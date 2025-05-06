# ---- 1️⃣ Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package.json and lock first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the full source code, including the public directory if it exists
COPY . .

# Ensure the public directory exists before copying it to the production stage
RUN mkdir -p public

# Build the Next.js app
RUN npm run build

# ---- 2️⃣ Production Stage ----
FROM node:18-alpine

WORKDIR /app

# Only copy the built app and necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Expose Next.js port
EXPOSE 3000

# Prune dev dependencies (optional)
RUN npm prune --production

# Start the Next.js app
CMD ["npm", "start"]
