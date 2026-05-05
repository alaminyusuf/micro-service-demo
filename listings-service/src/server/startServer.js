import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import logger from '../helpers/logger';
import setupRoutes from './routes';
import errorHandler from './middleware/errorHandler';

import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../graphql/typeDefs';
import resolvers from '../graphql/resolvers';
import axios from 'axios';

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://users-service:7101';

const app = express();

app.use(helmet());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json());

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  })
);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) return { req };
    try {
      const response = await axios.post(`${USERS_SERVICE_URL}/graphql`, {
        query: `query { session(id: "${sessionId}") { user { id email } } }`
      });
      if (response.data.data && response.data.data.session) {
        return { req, user: response.data.data.session.user, sessionId };
      }
      return { req };
    } catch (e) {
      return { req };
    }
  },
  formatError: (error) => {
    logger.error('GraphQL Error:', error);
    return error;
  },
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

app.use(errorHandler);

const port = 7100;
app.listen(port, () =>
  logger.info(`Listings service listening on port ${port}`)
);
