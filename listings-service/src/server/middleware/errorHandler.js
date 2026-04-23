import logger from '../helpers/logger';

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack,
  });

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
};

export default errorHandler;
