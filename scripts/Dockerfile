FROM node:20-alpine

RUN apk add --no-cache dcron curl bash

WORKDIR /simulator

COPY package.json ./
RUN npm install

COPY . .   

RUN mkdir -p /var/log

RUN echo "*/2 * * * * cd /simulator && node traffic_simulator.js >> /var/log/traffic-simulator.log 2>&1" > /etc/crontabs/root

RUN echo '#!/bin/bash' > /start.sh && \
    echo 'echo "🚀 Starting Traffic Simulator..."' >> /start.sh && \
    echo 'crontab -l' >> /start.sh && \
    echo 'crond -f -d 8' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 8080
CMD ["/start.sh"]
