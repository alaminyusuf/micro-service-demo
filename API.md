# GraphQL API Documentation

This project has been migrated from REST to GraphQL. The `api-gateway` listens on port `7000` and serves as the single GraphQL endpoint for all client traffic (`POST /graphql`).

## Types

```graphql
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
```

## Queries

### `listings`
Fetches all listings ordered by creation date.
```graphql
query {
  listings {
    id
    title
    description
    userId
  }
}
```

### `listing(id: ID!)`
Fetches a specific listing by its ID.

### `users`
Fetches all users.

### `user(id: ID!)`
Fetches a specific user by their ID.

### `session(id: ID!)`
Verifies a session and returns the active session object alongside the user details.

---

## Mutations

### `createListing(title: String!, description: String!, idempotencyKey: String): Listing!`
Creates a new listing.
**Headers Required:** `x-session-id`
**Idempotency:** Pass string into `idempotencyKey` to ensure multiple identical requests simulate exactly-once execution.

### `updateListing(id: ID!, title: String, description: String): Listing!`
Updates a listing. You must own this listing.
**Headers Required:** `x-session-id`

### `deleteListing(id: ID!): Boolean!`
Deletes a listing. You must own this listing.
**Headers Required:** `x-session-id`

### `createUser(email: String!, password: String!): User!`
Creates a new user.

### `updateUser(id: ID!, email: String, password: String): User!`
Updates a user's details.

### `deleteUser(id: ID!): Boolean!`
Deletes a user.

### `createSession(email: String!, password: String!): Session!`
Creates a login session and returns the Session object.

### `deleteSession(id: ID!): Boolean!`
Logs a user out by invalidating their Session.
