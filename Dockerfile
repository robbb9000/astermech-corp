FROM nginx:alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docs /usr/share/nginx/html
EXPOSE 8080
