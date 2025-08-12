# Multi-stage build for the full-stack application
FROM node:18-alpine AS base

# Install dependencies for both frontend and backend
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY server/ ./server/
COPY prisma/ ./prisma/
COPY --from=frontend-builder /app/client/build ./client/build

# Install Python and scraper dependencies
RUN apk add --no-cache python3 py3-pip
COPY scraper/requirements.txt ./scraper/
RUN pip3 install -r ./scraper/requirements.txt
COPY scraper/ ./scraper/

# Generate Prisma client
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"] 