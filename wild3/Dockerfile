FROM node:18-bookworm

# Install minimal runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Enable Corepack to use the right Yarn version
RUN corepack enable
RUN corepack prepare yarn@4.4.1 --activate

# Set working directory
WORKDIR /app

# Create a simplified app-config.docker.yaml that uses SQLite
RUN echo 'app:\n  baseUrl: http://localhost:7007\n\nbackend:\n  baseUrl: http://localhost:7007\n  listen:\n    port: 7007\n    host: 0.0.0.0\n  database:\n    client: better-sqlite3\n    connection: ":memory:"\n\nauth:\n  providers:\n    guest:\n      enabled: true' > app-config.docker.yaml

# Copy your backstage app's package.json and yarn.lock
COPY backstage/package.json backstage/yarn.lock ./

# Install dependencies (just enough to run the backend)
RUN yarn install && \
    yarn add @swc/core-linux-x64-gnu @swc/core-linux-x64-musl

# Copy just what we need from the Backstage directory
COPY backstage/packages/backend/dist ./packages/backend/dist
COPY backstage/plugins ./plugins
COPY backstage/examples ./examples

# Expose backend port
EXPOSE 7007

# Start the backend with the SQLite config
CMD ["sh", "-c", "cd packages/backend && exec node dist/index.cjs.js --config ../../app-config.docker.yaml"]