FROM nginx:1.11-alpine

ADD nginx.conf /etc/nginx/conf.d/default.conf
ADD build.tar /usr/share/nginx/html/
