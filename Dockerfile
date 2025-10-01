# Multi-stage Dockerfile for Demo Nuxt 4 Application
# Simplified for ECS deployment

# ============================================================================
# Stage 1: Base image with pnpm
# ============================================================================
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@10.13.1

# Set working directory
WORKDIR /app

# ============================================================================
# Stage 2: Dependencies installation
# ============================================================================
FROM base AS deps

# Copy package manager files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
#COPY layers/base/package.json ./layers/base/
#COPY layers/auth/package.json ./layers/auth/

# Install dependencies
RUN pnpm install --frozen-lockfile --prefer-offline

# ============================================================================
# Stage 3: Build stage
# ============================================================================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# ============================================================================
# Stage 4: Production runtime
# ============================================================================
FROM node:20-alpine AS runner

# Create app directory
WORKDIR /app

# Copy built application
COPY --from=builder /app/.output ./

# Expose port
EXPOSE 80

# Start the application
CMD ["node", "server/index.mjs"]