FROM node:18-alpine

# Install cron and other utilities
RUN apk add --no-cache \
    dcron \
    curl \
    bash

# Set working directory
WORKDIR /simulator

# Copy package files and install dependencies
COPY package.json .
RUN npm install

# Copy the traffic simulator script
COPY traffic_simulator.js .

# Create cron job to run traffic simulation every hour
RUN echo "*/2 * * * * cd /simulator && node traffic_simulator.js >> /var/log/traffic-simulator.log 2>&1" > /etc/crontabs/root

# Create log directory
RUN mkdir -p /var/log

# Make the script executable
RUN chmod +x traffic_simulator.js

# Create a startup script
RUN echo '#!/bin/bash' > /start.sh && \
    echo 'echo "🚀 Starting Traffic Simulator..."' >> /start.sh && \
    echo 'echo "📅 Cron jobs:"' >> /start.sh && \
    echo 'crontab -l' >> /start.sh && \
    echo 'echo "⏰ Starting cron daemon..."' >> /start.sh && \
    echo 'crond -f -d 8' >> /start.sh && \
    chmod +x /start.sh

# Expose port (not needed for this service, but good practice)
EXPOSE 8080

# Start cron daemon
CMD ["/start.sh"] 