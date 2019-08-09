ARG VERSION=2019.05.08
FROM getsentry/jekyll-base:builder-${VERSION} AS builder
FROM getsentry/jekyll-base:runtime-${VERSION} AS runtime
