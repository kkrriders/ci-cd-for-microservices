# Microservices E-Commerce Platform

A comprehensive e-commerce platform built using a microservices architecture. This project demonstrates the implementation of multiple services (Catalog and Orders) that work together to provide a scalable, maintainable, and resilient e-commerce backend.

![Microservices Architecture](https://via.placeholder.com/800x400?text=Microservices+Architecture)

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Services](#services)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Health Monitoring](#health-monitoring)
- [Development Workflow](#development-workflow)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Integration](#cicd-integration)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Architecture Overview

This project implements a microservices architecture with the following components:

- **Catalog Service**: Manages product information and inventory
- **Orders Service**: Handles order processing and management
- **MongoDB**: Database for persistent storage
- **Redis**: Caching layer for improved performance
- **Docker & Docker Compose**: For containerization and local development
- **Kubernetes**: For container orchestration in production

The services communicate with each other via REST APIs and are designed to be independently deployable and scalable.

## Technology Stack

### Backend Services
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM (Object Document Mapper)
- **Redis**: In-memory data structure store for caching
- **Winston**: Logging framework
- **Joi/Express-Validator**: Request validation
- **Swagger**: API documentation

### DevOps & Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Local multi-container orchestration
- **Kubernetes**: Container orchestration for production
- **Helm** (optional): Kubernetes package manager

### Monitoring & Observability
- **Health Check Endpoints**: For service monitoring
- **Prometheus** (optional): Metrics collection
- **Grafana** (optional): Metrics visualization

## Directory Structure

```
├── Docker/                # Contains all microservices
│   ├── catalog/           # Catalog service
│   │   ├── src/           # Source code
│   │   │   ├── config/    # Configuration files
│   │   │   ├── controllers/ # Request handlers
│   │   │   ├── middleware/ # Express middleware
│   │   │   ├── models/    # Data models
│   │   │   └── routes/    # API routes
│   │   ├── K8s/           # Kubernetes manifests
│   │   │   ├── configmap.yaml  # Environment configurations
│   │   │   ├── deployment.yaml # Deployment definition
│   │   │   ├── secrets.yaml    # Sensitive data
│   │   │   └── service.yaml    # Service definition
│   │   └── Dockerfile     # Container definition
│   ├── orders/            # Orders service
│   │   ├── src/           # Source code (same structure as catalog)
│   │   ├── K8s/           # Kubernetes manifests
│   │   └── Dockerfile     # Container definition
│   └── mongo-init/        # MongoDB initialization scripts
│       ├── init-mongo.js  # DB setup script
│       ├── catalog.json   # Sample catalog data
│       └── orders.json    # Sample orders data
├── docker-compose.yaml    # Docker Compose configuration
└── README.md              # Project documentation
```

## Services

### Catalog Service
The Catalog service manages the product inventory for the e-commerce platform. It provides APIs to:
- Create, read, update, and delete products
- Search and filter products by various criteria
- Manage product categories
- Track inventory and stock levels

**Port**: 8082

### Orders Service
The Orders service handles all order-related operations. It provides APIs to:
- Create and manage customer orders
- Process order payments
- Track order status and history
- Generate order statistics
- Process refunds

**Port**: 8083

### MongoDB
MongoDB serves as the persistent data store for both services, with separate collections for products and orders.

**Port**: 27017

### Redis
Redis is used as a caching layer to improve performance and reduce database load.

**Port**: 6379

### Mongo Express
A web-based MongoDB admin interface for easier database management during development.

**Port**: 8081

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git
- Kubernetes cluster (for production deployment)

### Quick Start

#### Using Docker Compose (Recommended)

The easiest way to run the application is using Docker Compose:

```bash
# Start all services
npm start

# Start all services in detached mode
npm run start:dev

# Stop all services
npm run stop
```

#### Running Individual Services

You can also run each service individually:

```bash
# Install dependencies for all services
npm run install:all

# Start catalog service
npm run start:catalog

# Start orders service
npm run start:orders

# Run catalog service in development mode
npm run dev:catalog

# Run orders service in development mode
npm run dev:orders
```

### Environment Variables

Each service has its own `.env` file with configuration options. Here are the key variables:

**Catalog Service**
```
PORT=8082
NODE_ENV=development
MONGODB_URI=mongodb://root:example@mongo:27017/Services_db?authSource=admin
REDIS_URI=redis://redis:6379
```

**Orders Service**
```
PORT=8083
NODE_ENV=development
MONGODB_URI=mongodb://root:example@mongo:27017/Services_db?authSource=admin
REDIS_URI=redis://redis:6379
CATALOG_SERVICE_URL=http://catalog:8082
```

## API Documentation

Swagger UI is available for exploring and testing the APIs:

- **Catalog API Docs**: http://localhost:8082/api/docs
- **Orders API Docs**: http://localhost:8083/api/docs

### Key Endpoints

**Catalog Service**
- `GET /api/v1/catalog` - List all products
- `GET /api/v1/catalog/:id` - Get a specific product
- `POST /api/v1/catalog` - Create a new product
- `PUT /api/v1/catalog/:id` - Update a product
- `DELETE /api/v1/catalog/:id` - Delete a product

**Orders Service**
- `GET /api/v1/orders` - List all orders
- `GET /api/v1/orders/:id` - Get a specific order
- `POST /api/v1/orders` - Create a new order
- `PUT /api/v1/orders/:id/status` - Update order status
- `DELETE /api/v1/orders/:id/cancel` - Cancel an order
- `GET /api/v1/users/:userId/orders` - Get user order history

## Health Monitoring

Health check endpoints are available for monitoring service status:

- **Catalog Health**: http://localhost:8082/health
- **Orders Health**: http://localhost:8083/health

Each service provides the following health endpoints:

- `/health` - Basic health check
- `/health/liveness` - Liveness probe for Kubernetes
- `/health/readiness` - Readiness probe with dependency checks
- `/health/details` - Detailed system and dependency information

## Development Workflow

### Local Development without Docker

```bash
# Catalog Service
cd Docker/catalog
npm install
npm run dev

# Orders Service
cd Docker/orders
npm install
npm run dev
```

### Running Tests

```bash
# Catalog Service
cd Docker/catalog
npm test

# Orders Service
cd Docker/orders
npm test
```

### Code Linting

```bash
# Catalog Service
cd Docker/catalog
npm run lint

# Orders Service
cd Docker/orders
npm run lint
```

## Kubernetes Deployment

For production deployment, use the Kubernetes manifests in each service's `K8s` directory:

```bash
# Create namespace
kubectl create namespace microservices

# Deploy catalog service
kubectl apply -f Docker/catalog/K8s/

# Deploy orders service
kubectl apply -f Docker/orders/K8s/
```

### Kubernetes Resources

Each service includes the following Kubernetes resources:

- **ConfigMap**: Environment configuration
- **Secret**: Sensitive data like database credentials
- **Deployment**: Pod configuration with replicas
- **Service**: Network access to pods

### Accessing Services in Kubernetes

After deployment, services are accessible within the Kubernetes cluster or through an Ingress controller:

```bash
# Port forward to access locally
kubectl port-forward -n microservices svc/catalog-service 8082:8082
kubectl port-forward -n microservices svc/orders-service 8083:8083
```

## CI/CD Integration

This project can be integrated with CI/CD pipelines using GitHub Actions, Jenkins, or other CI tools. A typical pipeline would include:

1. **Build**: Compile code and build Docker images
2. **Test**: Run unit and integration tests
3. **Scan**: Security and dependency scanning
4. **Push**: Push Docker images to a registry
5. **Deploy**: Deploy to Kubernetes

Example GitHub Actions workflow files are provided in the `.github/workflows` directory.

## Security

Our microservices architecture implements several layers of security:

### Container Security
- Multi-stage Docker builds to minimize image size and attack surface
- Non-root container execution with principle of least privilege
- Container vulnerability scanning with Trivy integrated into CI/CD pipeline
- Read-only filesystem for runtime containers where possible

### Secret Management
- HashiCorp Vault integration for dynamic secret generation and management
- Kubernetes Secrets integration for sensitive information
- No hardcoded credentials in code or images

### Network Security
- Service mesh (Istio) with mutual TLS encryption between services
- Kubernetes Network Policies to restrict service-to-service communication
- API Gateway with rate limiting and authentication

### Authentication & Authorization
- JWT-based API authentication
- OAuth2 integration for identity management
- RBAC (Role-Based Access Control) for Kubernetes resources

### Runtime Security
- Restricted Pod Security Context
- Falco for real-time security monitoring
- Regular security scanning with compliance reporting

### Compliance
- Automated security scanning reports
- Regular dependency vulnerability audits
- OWASP Top 10 protection measures

For detailed security implementation, see the [Security Documentation](docs/SECURITY.md).

## Troubleshooting

### Common Issues

**Docker Build Fails**
```
Check that Docker Desktop is running
Ensure you're in the root directory when running docker-compose build
Verify package.json and package-lock.json are in sync
```

**Services Can't Connect to MongoDB**
```
Check MongoDB container is running: docker-compose ps
Verify MongoDB credentials in .env files
Check network connectivity between containers
```

**API Returns 500 Errors**
```
Check service logs: docker-compose logs [service_name]
Verify database connection
Check environment variables are set correctly
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

Please ensure all tests pass and code follows the established style guidelines.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Express.js documentation and community
- MongoDB documentation and community
- Kubernetes documentation
- Docker documentation
