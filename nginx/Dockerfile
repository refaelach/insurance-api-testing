FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=api-testing-project-frontend /app/dist /usr/share/nginx/html 