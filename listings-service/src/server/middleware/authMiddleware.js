import axios from 'axios';
import logger from '../helpers/logger';

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://users-service:7101';

const authMiddleware = async (req, res, next) => {
  const sessionId = req.headers['x-session-id'];

  if (!sessionId) {
    const error = new Error('Session ID is missing');
    error.status = 401;
    return next(error);
  }

  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/sessions/${sessionId}`);
    req.user = response.data.user;
    req.sessionId = sessionId;
    next();
  } catch (error) {
    logger.error(`Authentication failed for session: ${sessionId}`, { error: error.message });
    const authError = new Error('Unauthorized');
    authError.status = 401;
    return next(authError);
  }
};

export default authMiddleware;
