

# ---------- Stage 1: Build the monorepo ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root config files
COPY package*.json turbo.json ./

# Copy apps and packages
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN npm install

# Build only the PrimaryBackend app
RUN npx turbo run build --filter=createworkflowtable


# ---------- Stage 2: Production image ----------
FROM node:20-alpine AS builder2



WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/apps/WorkFlowTable/dist ./dist

# Copy runtime package.json
COPY --from=builder /app/apps/WorkFlowTable/package*.json ./

# Copy the local packages your app depends on
COPY --from=builder /app/packages ./packages

# Copy node_modules (with monorepo links)
COPY --from=builder /app/node_modules ./node_modules



EXPOSE 3004

CMD ["node", "dist/index.js"]






