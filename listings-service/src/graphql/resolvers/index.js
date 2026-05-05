import { Listing } from '#root/db/models';
import logger from '#root/helpers/logger';

const resolvers = {
  Query: {
    listings: async () => {
      return await Listing.findAll({ order: [['createdAt', 'DESC']] });
    },
    listing: async (_, { id }) => {
      const listing = await Listing.findByPk(id);
      if (!listing) throw new Error('Listing not found');
      return listing;
    }
  },
  Mutation: {
    createListing: async (_, { title, description, idempotencyKey }, context) => {
      if (!context.user) throw new Error('Unauthorized');

      if (!title || !description) throw new Error('Title and description are required!');

      // Check idempotency
      if (idempotencyKey) {
        const existing = await Listing.findOne({ where: { idempotencyKey, userId: context.user.id } });
        if (existing) {
          logger.info(`Idempotency key hit: ${idempotencyKey} returning existing listing ${existing.id}`);
          return existing;
        }
      }

      const newListing = await Listing.create({
        description,
        title,
        userId: context.user.id,
        idempotencyKey,
      });

      logger.info(`Listing created: ${newListing.id} by user: ${context.user.id}`);
      return newListing;
    },
    updateListing: async (_, { id, title, description }, context) => {
      if (!context.user) throw new Error('Unauthorized');

      const listing = await Listing.findByPk(id);
      if (!listing) throw new Error('Listing not found');

      if (listing.userId !== context.user.id) {
        throw new Error('Unauthorized - You do not own this listing');
      }

      const updates = {};
      if (title) updates.title = title;
      if (description) updates.description = description;

      await listing.update(updates);
      logger.info(`Listing updated: ${listing.id} by user: ${context.user.id}`);
      return listing;
    },
    deleteListing: async (_, { id }, context) => {
      if (!context.user) throw new Error('Unauthorized');

      const listing = await Listing.findByPk(id);
      if (!listing) throw new Error('Listing not found');

      if (listing.userId !== context.user.id) {
        throw new Error('Unauthorized - You do not own this listing');
      }

      await listing.destroy();
      logger.info(`Listing deleted: ${id} by user: ${context.user.id}`);
      return true;
    }
  }
};

export default resolvers;
