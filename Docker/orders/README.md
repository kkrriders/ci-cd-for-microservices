# Orders Microservice

This microservice manages the order processing workflow for the e-commerce application.

## Features

- Order creation and management
- Order status tracking
- Order history for users
- Payment integration
- Shipping status updates
- Integration with catalog service

## Tech Stack

- Node.js & Express
- MongoDB for data storage
- Redis for caching
- Docker for containerization
- Kubernetes for orchestration

## API Documentation

API documentation is available at `/api/docs` when the service is running.

## Setup and Running

### Prerequisites

- Node.js 18+
- MongoDB
- Redis
- Docker and Docker Compose (for containerized development)

### Environment Variables

Configure the service using environment variables in `.env` file. See examples in the existing file.

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

### Docker

```bash
# Build the Docker image
docker build -t orders-service .

# Run the Docker container
docker run -p 8083:8083 --env-file .env orders-service
```

### Docker Compose

Use Docker Compose to run the entire stack including MongoDB and Redis:

```bash
docker-compose up -d
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Kubernetes Deployment

Use the Kubernetes manifests in the `K8s` directory to deploy the service to a Kubernetes cluster:

```bash
kubectl apply -f K8s/
```

## Monitoring and Health Checks

Health check endpoints:

- `/health` - Basic health check
- `/health/liveness` - Liveness probe
- `/health/readiness` - Readiness probe with dependency checks
- `/health/details` - Detailed system information

## Service Integration

This service communicates with:

- Catalog Service: To verify product availability and prices
- Auth Service: For user authentication and authorization 