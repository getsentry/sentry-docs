---
title: Installation
sidebar_order: 0
---

Sentry relies on multiple services to work, which are all orchestrated by [Dockes Compose](https://docs.docker.com/compose/) in [our on-premise repository](https://github.com/getsentry/onpremise).

## Requirements

-   [Docker](https://www.docker.com/) 17.05.0+
-   [Docker Compose](https://docs.docker.com/compose/) 1.19.0+
-   A dedicated (sub)domain to host Sentry on (i.e. _sentry.yourcompany.com_).
-   At least 2400MB memory
-   2 CPU Cores

## Installing Sentry Server

We strongly recommend using Docker, and specifically [our on-premise repository](https://github.com/getsentry/onpremise) for installing Sentry and all its services. If you need to do something custom, you can use this repository as the basis of your setup. If you do not wish to use the Docker images we provide, you can still find [Sentry on PyPI](https://pypi.org/project/sentry/), that said this method is not recommended. You'll need to work your way back from [the main Sentry image](https://github.com/getsentry/sentry/blob/master/docker/Dockerfile) and [the service composition](https://github.com/getsentry/onpremise/blob/master/docker-compose.yml). It is not too hard but you are likely to spend a lot more time and hit some bumps ahead.

To install Sentry from the on-premise repository, just clone the repository locally:

```bash
git clone git@github.com:getsentry/onpremise.git
```

Before starting the installation, we strongly recommend you to check out [how to configure your Sentry instance]({%- link _documentation/server/config.md -%}) as you'd need to rebuild your images (`docker-compose build`) if you ever want to change your configuration settings. You may copy and edit the example configs provided in the repository. If none exists, the install script will simply use these examples as the actual configurations.

To start, just run the install script:
```bash
./install.sh
```

If the `CI` environment variable is set to a non-empty value, the script will assume unattended installation and will skip some steps. You can look at [its source code](https://github.com/getsentry/onpremise/blob/master/install.sh) to figure out what those steps are, which will also be logged to standard output.

If you are upgrading from an earlier version of the on-premise repository, keep in mind that it will keep your existing configuration files, which you may need to adjust based on [the examples provided in the repository](https://github.com/getsentry/onpremise/tree/master/sentry).

If you have any issues or questions, our [community forums](https://forum.sentry.io/c/on-premise/onprem-official) and [Discord #sentry-server channel](https://discord.gg/mg5V76F) are always open!
