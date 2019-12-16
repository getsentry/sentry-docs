ARG VERSION=2019.05.08
FROM getsentry/jekyll-base:builder-${VERSION} AS builder
FROM getsentry/jekyll-base:runtime-${VERSION} AS runtime
CMD ["/bin/sh", "-c", "sed -i \"s/\\([[:space:]]\\{1,\\}\\)listen 80;/\\1listen ${PORT:-80};/\" /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
