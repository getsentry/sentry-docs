ARG VERSION=2020.01.23

FROM getsentry/jekyll-base:builder-${VERSION} AS builder

# we have to use a diff base image than jekyll due to the node version requirements
# XXX(dcramer): when jekyll is gone, there's a base imagine we can use if gatsby lives at document root
FROM node:12-buster as gatsby

ARG BUILD_CONF={}
ENV BUILD_CONF="$BUILD_CONF"

ARG ALGOLIA_INDEX=
ENV ALGOLIA_INDEX=$ALGOLIA_INDEX

ARG ALGOLIA_ADMIN_KEY=
ENV ALGOLIA_ADMIN_KEY=$ALGOLIA_ADMIN_KEY

RUN yarn global add gatsby-cli
WORKDIR /usr/src/app
ADD . ./
WORKDIR /usr/src/app/gatsby
RUN yarn
RUN gatsby build

FROM getsentry/jekyll-base:runtime-${VERSION} AS runtime

COPY --from=gatsby /usr/src/app/gatsby/public/ /usr/share/nginx/html/gatsby
COPY --from=builder /usr/src/app/_site/ /usr/share/nginx/html/jekyll
