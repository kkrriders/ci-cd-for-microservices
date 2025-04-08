# Stage 1: Building the app
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_CATALOG_API_URL=/api/catalog
ENV NEXT_PUBLIC_ORDERS_API_URL=/api/orders

# Build the Next.js app
RUN pnpm build

# Stage 2: Run the app
FROM node:20-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Copy necessary files from builder
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
COPY --from=builder /app/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

# Expose the app port
EXPOSE 3000

# Start the app using Next.js start command directly
CMD ["node_modules/.bin/next", "start"] 