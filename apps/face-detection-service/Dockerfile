# --- Base image with all native dependencies ---
FROM node:22-bookworm-slim

# System dependencies for canvas and tensorflow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpng-dev \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm and node-gyp globally
RUN npm install -g pnpm node-gyp

WORKDIR /app

# Copy root manifest and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set side-effects-cache false && pnpm install --frozen-lockfile

# Rebuild native modules for this environment
RUN pnpm rebuild canvas @tensorflow/tfjs-node || true

# Copy workspace config
COPY nest-cli.json tsconfig.json tsconfig.build.json ./

# Copy libraries since they are shared
COPY libs ./libs

# Copy strictly face-detection-service source (and other apps if needed, but usually we just build one)
COPY apps/face-detection-service ./apps/face-detection-service

EXPOSE 3000

# Start in dev mode within the monorepo context
CMD ["pnpm", "exec", "nest", "start", "--watch", "face-detection-service"]
