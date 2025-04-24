
FROM node:20-alpine as builder

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app from the builder stage
COPY --from=builder /app/dist ./dist

# Copy any necessary files like migrations
COPY --from=builder /app/src/db/migrations ./dist/db/migrations
COPY --from=builder /app/src/db/seeds ./dist/db/seeds

# Expose the API port
EXPOSE 4000

# Run the application
CMD ["node", "dist/server.js"]
