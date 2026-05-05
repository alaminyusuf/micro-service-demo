import { User, UserSessions } from '#root/db/models';
import generateUUID from '#root/helpers/generateUUID';
import hashPassword from '#root/helpers/hashPassword';
import passwordCompare from '#root/helpers/passwordCompare';
import logger from '#root/helpers/logger';

const resolvers = {
  Query: {
    users: async () => {
      return await User.findAll();
    },
    user: async (_, { id }) => {
      const user = await User.findByPk(id);
      if (!user) throw new Error('User not found');
      return user;
    },
    session: async (_, { id }) => {
      const session = await UserSessions.findByPk(id);
      if (!session || new Date() > session.expiresAt) {
        throw new Error('Session is invalid or expired');
      }
      const user = await User.findByPk(session.userId);
      return { session, user };
    }
  },
  Mutation: {
    createUser: async (_, { email, password }) => {
      const newUser = await User.create({
        email,
        id: generateUUID(),
        passwordHash: hashPassword(password),
      });
      logger.info(`User created: ${newUser.id}`);
      return newUser;
    },
    updateUser: async (_, { id, email, password }) => {
      const user = await User.findByPk(id);
      if (!user) throw new Error('User not found');

      const updates = {};
      if (email) updates.email = email;
      if (password) updates.passwordHash = hashPassword(password);

      await user.update(updates);
      logger.info(`User updated: ${user.id}`);
      return user;
    },
    deleteUser: async (_, { id }) => {
      const user = await User.findByPk(id);
      if (!user) throw new Error('User not found');
      await user.destroy();
      logger.info(`User deleted: ${id}`);
      return true;
    },
    createSession: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user || !passwordCompare(password, user.passwordHash)) {
        throw new Error('Invalid email or password');
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const session = await UserSessions.create({
        expiresAt,
        id: generateUUID(),
        userId: user.id,
      });

      logger.info(`Session created: ${session.id} for user: ${user.id}`);
      return session;
    },
    deleteSession: async (_, { id }) => {
      const session = await UserSessions.findByPk(id);
      if (!session) throw new Error('Session not found');
      await session.destroy();
      logger.info(`Session deleted: ${id}`);
      return true;
    }
  }
};

export default resolvers;
