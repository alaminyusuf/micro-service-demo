import { executeGraphql } from '#root/helpers/downstreamService';

const resolvers = {
  Query: {
    listings: async () => {
      const data = await executeGraphql('listings', 'query { listings { id title description userId idempotencyKey } }');
      return data.listings;
    },
    listing: async (_, { id }) => {
      const data = await executeGraphql('listings', `query { listing(id: "${id}") { id title description userId idempotencyKey } }`);
      return data.listing;
    },
    users: async () => {
      const data = await executeGraphql('users', 'query { users { id email } }');
      return data.users;
    },
    user: async (_, { id }) => {
      const data = await executeGraphql('users', `query { user(id: "${id}") { id email } }`);
      return data.user;
    },
    session: async (_, { id }) => {
      const data = await executeGraphql('users', `query { session(id: "${id}") { session { id userId expiresAt } user { id email } } }`);
      return data.session;
    }
  },
  Mutation: {
    createListing: async (_, { title, description, idempotencyKey }, context) => {
      const sessionId = context.req.headers['x-session-id'] || '';
      const data = await executeGraphql(
        'listings',
        `mutation($title: String!, $description: String!, $idempotencyKey: String) { 
           createListing(title: $title, description: $description, idempotencyKey: $idempotencyKey) { id title description userId idempotencyKey } 
         }`,
        { title, description, idempotencyKey },
        { 'x-session-id': sessionId }
      );
      return data.createListing;
    },
    updateListing: async (_, { id, title, description }, context) => {
      const sessionId = context.req.headers['x-session-id'] || '';
      const data = await executeGraphql(
        'listings',
        `mutation($id: ID!, $title: String, $description: String) { 
           updateListing(id: $id, title: $title, description: $description) { id title description userId idempotencyKey } 
         }`,
        { id, title, description },
        { 'x-session-id': sessionId }
      );
      return data.updateListing;
    },
    deleteListing: async (_, { id }, context) => {
      const sessionId = context.req.headers['x-session-id'] || '';
      const data = await executeGraphql(
        'listings',
        `mutation($id: ID!) { deleteListing(id: $id) }`,
        { id },
        { 'x-session-id': sessionId }
      );
      return data.deleteListing;
    },
    createUser: async (_, { email, password }) => {
      const data = await executeGraphql(
        'users',
        `mutation($email: String!, $password: String!) { createUser(email: $email, password: $password) { id email } }`,
        { email, password }
      );
      return data.createUser;
    },
    updateUser: async (_, { id, email, password }) => {
      const data = await executeGraphql(
        'users',
        `mutation($id: ID!, $email: String, $password: String) { updateUser(id: $id, email: $email, password: $password) { id email } }`,
        { id, email, password }
      );
      return data.updateUser;
    },
    deleteUser: async (_, { id }) => {
      const data = await executeGraphql('users', `mutation($id: ID!) { deleteUser(id: $id) }`, { id });
      return data.deleteUser;
    },
    createSession: async (_, { email, password }) => {
      const data = await executeGraphql(
        'users',
        `mutation($email: String!, $password: String!) { createSession(email: $email, password: $password) { id userId expiresAt } }`,
        { email, password }
      );
      return data.createSession;
    },
    deleteSession: async (_, { id }) => {
      const data = await executeGraphql('users', `mutation($id: ID!) { deleteSession(id: $id) }`, { id });
      return data.deleteSession;
    }
  }
};

export default resolvers;
