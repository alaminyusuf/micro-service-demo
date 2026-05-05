import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import logger from '#root/helpers/logger';
import setupRoutes from './routes';
import errorHandler from './middleware/errorHandler';

import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../graphql/typeDefs';
import resolvers from '../graphql/resolvers';

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
  formatError: (error) => {
    logger.error('GraphQL Error:', error);
    return error;
  },
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

app.use(errorHandler);

const port = 7101;
app.listen(port, '0.0.0.0', () =>
  logger.info(`Users service listening on port ${port}`)
);
