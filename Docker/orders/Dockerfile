# syntax=docker/dockerfile:1

# Use specific version for base image
FROM node:20.10.0-alpine AS builder

# Create a non-privileged user
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nodeuser -G nodejs

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Use multi-stage build
FROM node:20.10.0-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy only production dependencies from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# Use non-root user
USER 1001

# Set read-only filesystem where possible
VOLUME ["/tmp", "/usr/src/app/logs"]

# Apply security labels
LABEL org.label-schema.security.hardened="true"
LABEL org.opencontainers.image.source="https://github.com/yourusername/microservices-ecommerce"

# Healthcheck for container orchestration systems
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8083/health/liveness || exit 1

EXPOSE 8083

CMD ["node", "src/index.js"]
