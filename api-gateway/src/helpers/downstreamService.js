import got from 'got';
import CircuitBreaker from 'opossum';
import logger from '#root/helpers/logger';

// For demonstration of load balancing, we can assume multiple instances
const USERS_SERVICE_URLS = [
  process.env.USERS_SERVICE_URL || 'http://users-service:7101',
];

const LISTINGS_SERVICE_URLS = [
  process.env.LISTINGS_SERVICE_URL || 'http://listings-service:7100',
];

let usersIndex = 0;
let listingsIndex = 0;

const getServiceUrl = (serviceName) => {
  if (serviceName === 'users') {
    const url = USERS_SERVICE_URLS[usersIndex];
    usersIndex = (usersIndex + 1) % USERS_SERVICE_URLS.length;
    return url;
  }
  if (serviceName === 'listings') {
    const url = LISTINGS_SERVICE_URLS[listingsIndex];
    listingsIndex = (listingsIndex + 1) % LISTINGS_SERVICE_URLS.length;
    return url;
  }
  throw new Error('Unknown service');
};

const executeGraphQLRequest = async ({ service, query, variables, headers }) => {
  const url = getServiceUrl(service);
  const response = await got.post(`${url}/graphql`, {
    json: { query, variables },
    responseType: 'json',
    headers: headers || {},
  });
  
  if (response.body.errors && response.body.errors.length > 0) {
    throw new Error(response.body.errors[0].message);
  }
  return response.body.data;
};

// Setup Circuit Breaker
const circuitBreakerOptions = {
  timeout: 5000, 
  errorThresholdPercentage: 50, 
  resetTimeout: 10000,
};

const graphqlBreaker = new CircuitBreaker(executeGraphQLRequest, circuitBreakerOptions);

graphqlBreaker.fallback(() => {
  logger.error('Circuit breaker open! Returning fallback null/error.');
  throw new Error('Service is temporarily unavailable (Circuit Breaker OPEN)');
});

graphqlBreaker.on('open', () => logger.warn('Circuit breaker opened.'));
graphqlBreaker.on('halfOpen', () => logger.warn('Circuit breaker half-open.'));
graphqlBreaker.on('close', () => logger.info('Circuit breaker closed.'));

export const executeGraphql = async (service, query, variables = {}, headers = {}) => {
  return await graphqlBreaker.fire({ service, query, variables, headers });
};
