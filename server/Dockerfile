FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source code and build
COPY src ./src
RUN npm run build

# -------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled dist from builder
COPY --from=builder /app/dist ./dist

# Create uploads folder
RUN mkdir -p uploads

EXPOSE 5000

ENV PORT=5000

CMD ["node", "dist/index.js"]
