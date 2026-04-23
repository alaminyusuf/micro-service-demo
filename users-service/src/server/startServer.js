import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import logger from '#root/helpers/logger';
import setupRoutes from './routes';
import errorHandler from './middleware/errorHandler';

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

setupRoutes(app);

app.use(errorHandler);

const port = 7101;
app.listen(port, '0.0.0.0', () =>
  logger.info(`Users service listening on port ${port}`)
);
