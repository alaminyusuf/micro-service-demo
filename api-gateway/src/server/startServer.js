import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';

import resolvers from '#root/graphql/resolvers';
import typeDefs from '#root/graphql/typeDefs';

import accessEnv from '#root/helpers/accessEnv';
import logger from '#root/helpers/logger';

const apolloServer = new ApolloServer({
  context: (a) => a,
  formatError: (error) => {
    logger.error('GraphQL Error:', error);
    return error;
  },
  resolvers,
  typeDefs,
});

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

app.use(cookieParser());
app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  })
);

apolloServer.applyMiddleware({
  app,
  cors: false,
  path: '/graphql',
});

try {
  app.listen(7000, () =>
    console.info('API gateway listening on port 7000')
  );
} catch (err) {
  throw err;
}
