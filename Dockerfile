ARG VERSION=2018.09.22
FROM getsentry/jekyll-base:builder-${VERSION} AS builder
FROM getsentry/jekyll-base:runtime-${VERSION} AS runtime
