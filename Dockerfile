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

LABEL maintainer="Your Name <your.email@example.com>"
LABEL org.opencontainers.image.source="https://github.com/your/repo"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Create non-root user and group
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001 -G nodejs

# Copy dependencies and app from build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./

# Set ownership and permissions explicitly (optional but recommended)
RUN chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]
