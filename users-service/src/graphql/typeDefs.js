import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type Session {
    id: ID!
    userId: ID!
    expiresAt: String!
  }

  type SessionInfo {
    session: Session!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    session(id: ID!): SessionInfo
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
    updateUser(id: ID!, email: String, password: String): User!
    deleteUser(id: ID!): Boolean!
    
    createSession(email: String!, password: String!): Session!
    deleteSession(id: ID!): Boolean!
  }
`;

export default typeDefs;
