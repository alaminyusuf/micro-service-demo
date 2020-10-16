import cors from 'cors';
import express from 'express';

// import accessEnv from '../helpers/accessEnv';

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

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: err.message,
  });
});

app.listen(7101, () =>
  console.log('users services listening on port 7101')
);
