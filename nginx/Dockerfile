# First stage: get dist/ from built frontend image
FROM rafauser/insurance-frontend as frontend-build

# Final stage: NGINX serving the frontend
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

# ✅ Copy frontend build from the previous stage
COPY --from=frontend-build /usr/share/nginx/html /usr/share/nginx/html
