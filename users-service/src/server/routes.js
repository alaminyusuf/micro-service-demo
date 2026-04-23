import { User, UserSessions } from '#root/db/models';
import generateUUID from '#root/helpers/generateUUID';
import hashPassword from '#root/helpers/hashPassword';
import passwordCompare from '#root/helpers/passwordCompare';
import logger from '#root/helpers/logger';

/**
 * Sets up user-related routes for the application.
 * @param {import('express').Express} app - The Express application instance.
 */
const setupRoutes = (app) => {
  /**
   * @api {post} /users Create a new user
   * @apiName CreateUser
   * @apiGroup User
   */
  app.post('/users', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email and password are required!');
      error.status = 400;
      throw error;
    }

    const newUser = await User.create({
      email,
      id: generateUUID(),
      passwordHash: hashPassword(password),
    });

    logger.info(`User created: ${newUser.id}`);
    return res.status(201).json(newUser);
  });

  /**
   * @api {get} /users Get all users
   * @apiName GetUsers
   * @apiGroup User
   */
  app.get('/users', async (req, res) => {
    const users = await User.findAll();
    return res.json(users);
  });

  /**
   * @api {get} /users/:userId Get user by ID
   * @apiName GetUser
   * @apiGroup User
   */
  app.get('/users/:userId', async (req, res) => {
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return res.json(user);
  });

  /**
   * @api {put} /users/:userId Update user
   * @apiName UpdateUser
   * @apiGroup User
   */
  app.put('/users/:userId', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const updates = {};
    if (email) updates.email = email;
    if (password) updates.passwordHash = hashPassword(password);

    await user.update(updates);

    logger.info(`User updated: ${user.id}`);
    return res.json(user);
  });

  /**
   * @api {delete} /users/:userId Delete user
   * @apiName DeleteUser
   * @apiGroup User
   */
  app.delete('/users/:userId', async (req, res) => {
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    await user.destroy();

    logger.info(`User deleted: ${req.params.userId}`);
    return res.status(204).send();
  });

  /**
   * @api {post} /sessions Create a new session (Login)
   * @apiName CreateSession
   * @apiGroup Session
   */
  app.post('/sessions', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email and password are required!');
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !passwordCompare(password, user.passwordHash)) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const session = await UserSessions.create({
      expiresAt,
      id: generateUUID(),
      userId: user.id,
    });

    logger.info(`Session created: ${session.id} for user: ${user.id}`);
    return res.status(201).json(session);
  });

  /**
   * @api {get} /sessions/:sessionId Verify session
   * @apiName GetSession
   * @apiGroup Session
   */
  app.get('/sessions/:sessionId', async (req, res) => {
    const session = await UserSessions.findByPk(req.params.sessionId);

    if (!session || new Date() > session.expiresAt) {
      const error = new Error('Session is invalid or expired');
      error.status = 401;
      throw error;
    }

    const user = await User.findByPk(session.userId);
    return res.json({ session, user });
  });

  /**
   * @api {delete} /sessions/:sessionId Delete session (Logout)
   * @apiName DeleteSession
   * @apiGroup Session
   */
  app.delete('/sessions/:sessionId', async (req, res) => {
    const session = await UserSessions.findByPk(req.params.sessionId);

    if (!session) {
      const error = new Error('Session not found');
      error.status = 404;
      throw error;
    }

    await session.destroy();

    logger.info(`Session deleted: ${req.params.sessionId}`);
    return res.status(204).send();
  });
};

export default setupRoutes;
