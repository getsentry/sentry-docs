# Sentry api documentation generation environment
#
# Instructions:
#
#   Build the container:
#     $ docker build -t sentry:apidocs -f Dockerfile.apidocs .
#   Run the container:
#     $ docker run --rm -v $(pwd):/usr/src/output sentry:apidocs
#
# The container will dump the generated documentation in markdown and JSON
# formats into the /usr/src/output directory which you should mount as a volume
#
FROM python:2.7.15-slim-stretch

RUN mkdir -p /usr/share/man/man1 \
  /usr/share/man/man2 \
  /usr/share/man/man3 \
  /usr/share/man/man4 \
  /usr/share/man/man5 \
  /usr/share/man/man6 \
  /usr/share/man/man7

RUN groupadd -r redis --gid=998 \
  && useradd -r -g redis --uid=998 redis \
  && groupadd -r postgres --gid=999 \
  && useradd -r -g postgres --uid=999 postgres

ENV PG_MAJOR 9.6
ENV PATH /usr/lib/postgresql/$PG_MAJOR/bin:$PATH

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    clang \
    curl \
    g++ \
    gcc \
    git \
    libffi-dev \
    libjpeg-dev \
    libpq-dev \
    libxml2-dev \
    libxslt-dev \
    libyaml-dev \
    llvm \
    bzip2 \
    make \
    postgresql-$PG_MAJOR \
    postgresql-contrib-$PG_MAJOR \
    redis-server \
    unzip \
  && rm -rf /var/lib/apt/lists/*

# Sane defaults for pip
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on
ENV PYTHONUNBUFFERED 1

# Disable yarn installation
ENV SENTRY_LIGHT_BUILD=1

# Update postgres configuration to allow local access
RUN rm "/etc/postgresql/$PG_MAJOR/main/pg_hba.conf" \
  && touch "/etc/postgresql/$PG_MAJOR/main/pg_hba.conf" \
  && chown -R postgres "/etc/postgresql/$PG_MAJOR/main/pg_hba.conf" \
  && { echo; echo "host all all 0.0.0.0/0 trust"; } >> "/etc/postgresql/$PG_MAJOR/main/pg_hba.conf" \
  && { echo; echo "local all all trust"; } >> "/etc/postgresql/$PG_MAJOR/main/pg_hba.conf"

RUN mkdir -p /usr/src/bin
COPY scripts/build-api-docs /usr/bin

WORKDIR /usr/src
VOLUME /usr/src/output

CMD [ "/usr/bin/build-api-docs" ]
