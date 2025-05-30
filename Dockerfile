# ---------- Stage 1: Build the application ----------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the codebase
COPY . .

# Build TypeScript project
RUN npm run build

# ---------- Stage 2: Run the application ----------
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built code from builder
COPY --from=builder /app/dist ./dist
COPY .env .env

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]
