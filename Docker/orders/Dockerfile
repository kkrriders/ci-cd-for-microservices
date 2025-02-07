# syntax=docker/dockerfile:1

ARG NODE_VERSION=23.7.0
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Use non-root user
USER node

# Expose Orders API on port 8081
EXPOSE 8083

# Start the service
CMD ["npm", "start"]
