# Micro-service Demo

A simple micro-service demonstration project with `users-service`, `listings-service`, and an `api-gateway`.

## Features

- **Session Management**: Implemented user login/logout and session verification.
- **Authentication**: Protected listings operations with session-based authentication.
- **User-Listing Relationship**: Established a database relationship between users and their listings.
- **Structured Logging**: Integrated Winston for structured JSON logging.
- **Centralized Error Handling**: Unified error response format across services.
- **Security**: Basic security headers using Helmet.
- **Documentation**: Inline JSDoc and comprehensive API documentation.

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

## API Documentation

For detailed information on API endpoints, request patterns, and response formats, please refer to [API.md](./API.md).

## Project Structure

- `api-gateway/`: Routes requests to the appropriate microservice.
- `users-service/`: Manages user data and sessions.
- `listings-service/`: Manages listings data.
- `API.md`: Detailed API documentation.

## Logging & Error Handling

Each service uses Winston for logging and a centralized error handling middleware to ensure consistent error responses in JSON format.
