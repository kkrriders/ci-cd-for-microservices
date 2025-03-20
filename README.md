# Microservices E-Commerce Platform

A modern e-commerce platform built with a microservices architecture, featuring catalog and order services.

## Architecture

This project implements a microservices architecture with the following components:

- **Catalog Service**: Manages product information and inventory
- **Orders Service**: Handles order processing and management
- **MongoDB**: Database for persistent storage
- **Redis**: Caching layer for improved performance
- **Docker & Docker Compose**: For containerization and local development
- **Kubernetes**: For container orchestration in production

## Directory Structure

```
├── Docker/                # Contains all microservices
│   ├── catalog/           # Catalog service
│   │   ├── src/           # Source code
│   │   ├── K8s/           # Kubernetes manifests
│   │   └── Dockerfile     # Container definition
│   ├── orders/            # Orders service
│   │   ├── src/           # Source code
│   │   ├── K8s/           # Kubernetes manifests
│   │   └── Dockerfile     # Container definition
│   └── mongo-init/        # MongoDB initialization scripts
├── docker-compose.yaml    # Docker Compose configuration
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Kubernetes cluster (for production deployment)

### Running with Docker Compose

The easiest way to run the application locally is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

This will start:

- Catalog Service (http://localhost:8082)
- Orders Service (http://localhost:8083)
- MongoDB (localhost:27017)
- Redis (localhost:6379)
- Mongo Express (http://localhost:8081)

### Kubernetes Deployment

For production deployment, use the Kubernetes manifests in each service's `K8s` directory:

```bash
# Create namespace
kubectl create namespace microservices

# Deploy catalog service
kubectl apply -f Docker/catalog/K8s/

# Deploy orders service
kubectl apply -f Docker/orders/K8s/
```

## Documentation

API documentation is available at:

- Catalog Service: http://localhost:8082/api/docs
- Orders Service: http://localhost:8083/api/docs

## Health Checks

Health check endpoints are available at:

- Catalog Service: http://localhost:8082/health
- Orders Service: http://localhost:8083/health

## Contributing

Please see the individual service README files for more detailed information about each microservice.
