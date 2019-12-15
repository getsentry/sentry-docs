ARG VERSION=2019.05.08
FROM getsentry/jekyll-base:builder-${VERSION} AS builder
FROM getsentry/jekyll-base:runtime-${VERSION} AS runtime
CMD ["/bin/bash", "-c", "\"PORT=\"${PORT:-80}\" envsubst < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'\""]
