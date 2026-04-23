import { User } from '#root/db/models';
import generateUUID from '#root/helpers/generateUUID';
import hashPassword from '#root/helpers/hashPassword';
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
};

export default setupRoutes;
