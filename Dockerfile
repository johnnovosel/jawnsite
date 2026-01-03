ARG NODE_VERSION=22.14.0-alpine

# Use a lightweight Node.js image for development
FROM node:${NODE_VERSION} AS dev

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install project dependencies
RUN --mount=type=cache,target=/root/.npm npm install

# Copy the rest of the application source code into the container
COPY . .

# Expose the port used by the Next server in production
EXPOSE 8000

# Build the app and then start the Next production server so API routes run
CMD ["sh", "-lc", "npm run build && npm run start"]