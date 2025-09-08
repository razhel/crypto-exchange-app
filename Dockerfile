# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Runtime stage
FROM node:18-alpine

LABEL maintainer="flipmode@wp.tv"
LABEL org.opencontainers.image.source="https://github.com/razhel/crypto-exchange-app"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create non-root user and group
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001 -G nodejs

# Copy dependencies and app from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./

# Set ownership and permissions explicitly (optional but recommended)
RUN chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000

# Healthcheck command using curl (optional, can also use node's built-in HTTP)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --silent --fail http://localhost:3000/health || exit 1

# Start the app using app.js directly
CMD ["node", "src/app.js"]
