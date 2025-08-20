# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source code
COPY . .

# Build static files with Vite
RUN npm run build

# Production stage - just the built files
FROM nginx:alpine AS production

# Copy the built files to nginx's default directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx-simple.conf /etc/nginx/nginx.conf

# Remove the default.conf that conflicts with our custom configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
