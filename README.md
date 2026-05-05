# Micro-service Demo

A simple micro-service demonstration project with `users-service`, `listings-service`, and an `api-gateway`.

## Advanced Features & Refactoring

- **Database Relationships**: Listings carry a `userId` denoting the user who owns them.
- **REST to GraphQL Migration**: The `users-service` and `listings-service` have been refactored from Express REST APIs into GraphQL microservices using `apollo-server-express`.
- **API Gateway Federation**: The `api-gateway` operates as the single entry point. It accepts GraphQL requests and delegates them to internal microservice GraphQL endpoints using a custom HTTP fetcher.
- **Idempotency**: Added an `idempotencyKey` parameter to the `createListing` mutation to simulate secure, deduplicated operations (like financial transactions or inventory provisioning).
- **Service Resiliency & Circuit Breakers**: Configured an `opossum` Circuit Breaker in the gateway. If a downstream service is struggling or offline, the circuit breaker opens and fails fast, protecting resources.
- **Load Balancing**: The API Gateway uses a simple round-robin Array approach to route to internal service instances.
- **Unified Error Handling & Logging**: Installed and configured `winston` for application logs across all three services, alongside consistent `apollo-server` `formatError` interceptors.

## Getting Started

### Prerequisites

- Node.js
- Docker & Docker Compose

### Running the Services

1. Clone the repository.
2. Build and start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Documentation

For detailed information on the new GraphQL API documentation, types, and request formats, please refer to [API.md](./API.md).

## Project Structure

- `api-gateway/`: GraphQL gateway with Circuit Breaker and Load Balancing.
- `users-service/`: GraphQL service managing user data and session authentication.
- `listings-service/`: GraphQL service managing listings, ownership, and idempotency logic.
