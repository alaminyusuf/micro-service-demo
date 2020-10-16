import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import resolvers from '#root/graphql/resolvers';
import typeDefs from '#root/graphql/typeDefs';

// import accessEnv from '#root/helpers/accessEnv';

const apolloServer = new ApolloServer({
  context: (a) => a,
  resolvers,
  typeDefs,
});

const app = express();

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
