Dockerized Express.js Application
This project demonstrates how to containerize a simple Express.js application using Docker and Docker Compose. The application serves a "Hello, Docker!" message on port 4567.
Project Structure
express-app/
├── express.js          # Main application file
├── package.json        # Dependencies
├── Dockerfile          # Docker image configuration
├── docker-compose.yml  # Docker Compose configuration
└── README.md           # This file
Prerequisites

Docker Desktop (Windows/Mac) or Docker Engine (Linux)
Docker Compose (included with Docker Desktop)

Windows-Specific Requirements

Windows 10/11 with WSL 2 enabled
Docker Desktop for Windows

Quick Start

Clone this repository or download the files
Navigate to the project directory
Run the application with Docker Compose:

bashdocker-compose up -d

Access the application in your browser at:

http://localhost:4567
Docker Configuration
Dockerfile
The Dockerfile defines how the application image is built:
dockerfile# Base image - Node.js LTS (Long Term Support)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port 4567 to be able to access the app from outside the container
EXPOSE 4567

# Set environment variable to run in production mode
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "express.js"]
Docker Compose
The docker-compose.yml file configures the deployment:
yamlversion: '3.8'

services:
  express-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "4567:4567"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
Express.js Application
The application is a minimal Express.js server:
javascript// app.js
const express = require('express');
const app = express();
const port = 4567;

app.get('/', (req, res) => {
  res.send('Hello, Docker!');
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
Usage Commands
Start the Application
bashdocker-compose up -d
The -d flag runs the container in detached mode (in the background).
Check Container Status
bashdocker-compose ps
View Application Logs
bashdocker-compose logs
To follow the logs in real-time:
bashdocker-compose logs -f
Stop the Application
bashdocker-compose down
Rebuild the Application After Changes
bashdocker-compose up -d --build
Customization
Changing the Port
To use a different port (e.g., 3000), modify the docker-compose.yml file:
yamlports:
  - "3000:4567"
This maps host port 3000 to container port 4567.
Troubleshooting
Common Issues

Port already in use
Error: listen EADDRINUSE: address already in use :::4567
Solution: Stop any other application using port 4567 or change the port mapping in docker-compose.yml
Docker not running
Cannot connect to the Docker daemon
Solution: Make sure Docker Desktop is running.
Container not starting
Check the logs:
bashdocker-compose logs