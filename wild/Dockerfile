FROM node:18-bullseye-slim

WORKDIR /app

# Install minimal dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create a package.json with just what we need
RUN echo '{"name":"backstage-custom-action-demo","version":"0.1.0","type":"module","dependencies":{"fs-extra":"^11.1.1"}}' > package.json

# Install dependencies
RUN npm install

# Expose port for our demo app
EXPOSE 3000

# Copy our demo app and action
COPY . .

# Start the demo
CMD ["node", "demo.js"]
