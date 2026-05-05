import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Listing {
    id: ID!
    title: String!
    description: String!
    userId: ID!
    idempotencyKey: String
  }

  type Query {
    listings: [Listing!]!
    listing(id: ID!): Listing
  }

  type Mutation {
    createListing(title: String!, description: String!, idempotencyKey: String): Listing!
    updateListing(id: ID!, title: String, description: String): Listing!
    deleteListing(id: ID!): Boolean!
  }
`;

export default typeDefs;
