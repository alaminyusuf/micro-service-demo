import { gql } from 'apollo-server';

const typeDefs = gql`
  type Listing {
    id: ID!
    title: String!
    description: String!
    userId: ID!
    idempotencyKey: String
  }

  type User {
    id: ID!
    email: String!
  }

  type SessionInfo {
    session: Session!
    user: User!
  }

  type Session {
    id: ID!
    userId: ID!
    expiresAt: String!
  }

  type Query {
    listings: [Listing!]!
    listing(id: ID!): Listing
    users: [User!]!
    user(id: ID!): User
    session(id: ID!): SessionInfo
  }

  type Mutation {
    createListing(title: String!, description: String!, idempotencyKey: String): Listing!
    updateListing(id: ID!, title: String, description: String): Listing!
    deleteListing(id: ID!): Boolean!
    
    createUser(email: String!, password: String!): User!
    updateUser(id: ID!, email: String, password: String): User!
    deleteUser(id: ID!): Boolean!
    
    createSession(email: String!, password: String!): Session!
    deleteSession(id: ID!): Boolean!
  }
`;

export default typeDefs;
