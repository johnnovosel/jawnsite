ARG NODE_VERSION=22.14.0-alpine

# --- Build stage: compile the Vite app to static files ---
FROM node:${NODE_VERSION} AS build

WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install exact, reproducible dependencies
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the source and build the static bundle into /app/dist
COPY . .
RUN npm run build

# --- Serve stage: static files behind nginx ---
FROM nginx:alpine AS prod

# SPA config with /index.html fallback (listens on 5173)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
