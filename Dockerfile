ARG VERSION=2018.08.17
FROM getsentry/jekyll-base:builder-${VERSION} AS builder
FROM getsentry/jekyll-base:runtime-${VERSION} AS runtime
