import { User } from '#root/db/models';

import generateUUID from '#root/helpers/generateUUID';
import hashPassword from '#root/helpers/hashPassword';

const setupRoutes = (app) => {
  app.post('/users', async (req, res, next) => {
    if (!req.body.email || req.body.password) {
      return next(new Error('Invalid Body!'));
    }

    try {
      const newUser = await User.create({
        email: req.body.email,
        id: generateUUID(),
        passwordHash: hashPassword(req.body.password),
      });
      return newUser;
    } catch (error) {
      console.log('-----Error----', { error });
      throw error;
    }
  });
};

export default setupRoutes;
