FROM nginx:alpine
COPY build /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

CMD ["nginx", "-g", "daemon off;"]