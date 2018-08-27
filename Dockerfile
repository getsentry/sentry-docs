ARG VERSION=2018.08.27
FROM getsentry/jekyll-base:builder-${VERSION} AS builder
FROM getsentry/jekyll-base:runtime-${VERSION} AS runtime
