import cors from 'cors';
import express from 'express';

import accessEnv from '../helpers/accessEnv';

import setupRoutes from './routes';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credential: true,
  })
);

setupRoutes(app);

app.listen(7100, () =>
  console.log('listings services listening on port 7100')
);
