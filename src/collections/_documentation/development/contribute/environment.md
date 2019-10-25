---
title: 'Development Environment'
sidebar_order: 1
---

## Setting up Your Development Environment

### Linux

Just follow the [_official installation from source instructions_]({%- link _documentation/server/installation/python/index.md -%}).

### Macintosh OS X

To get started, fork the repo at [https://github.com/getsentry/sentry](https://github.com/getsentry/sentry) and clone it:

```bash
git clone https://github.com/<your github username>/sentry.git
cd sentry
```

Install [Homebrew](http://brew.sh), if you haven’t already. Run `brew bundle` to install the various system packages as listed in sentry's `Brewfile`. This will install, among other things, Python 2 and docker.

It is highly recommended to develop inside a Python virtual environment, so install `virtualenv` and `virtualenvwrapper`:

```bash
pip install virtualenv virtualenvwrapper
```

Then append the following to your shell profile (e.g. `~/.bashrc`) and reload it:

```bash
echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc
exec bash
```

Setup and activate a Python 2.7 virtual environment in the project root:

```bash
mkvirtualenv sentry
```

Install `nvm` and use it to install the node version specified in the `.nvmrc` file:

```bash
brew install nvm
echo "source /usr/local/opt/nvm/nvm.sh" >> ~/.bashrc
exec bash
nvm install
```

Run the following to install the Python and JavaScript libraries and database services that Sentry depends on and some extra pieces that hold the development environment together:

```bash
make bootstrap
```

{% capture __alert_content -%}
`make bootstrap` will run `sentry upgrade`, which will prompt you to create a user. It is recommended to supply the prompts with a proper email address and password. It is also required to designate said user as a **superuser** because said user is responsible for the initial configurations.
{%- endcapture -%}{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

`make bootstrap` will generally run these sequence of commands (you can poke around through the `Makefile` file to see more details):

```bash
make install-system-pkgs
make develop
# creates a development configuration file at ~/.sentry/sentry.conf.py
sentry init --dev
# start up our development services
sentry devservices up
make create-db
make apply-migrations
```

## Running the Development Server

{% capture __alert_content -%}
If you would like to import an example dataset, running `./bin/load-mocks` will add a few example projects and teams to the main organization.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

Once you’ve successfully stood up your datastore, you can now run the development server:

```bash
sentry devserver --workers
```

{% capture __alert_content -%}
If you are developing for aesthetics only and do not rely on the async workers, you can omit the `--workers` flag in order to use less system resources.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}{% capture __alert_content -%}
If you would like to be able to run `devserver` outside of your root checkout, you can install `webpack` globally with `npm install -g webpack`.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

When webpack finishes processing, you can find a login prompt for the user account you previously created at [http://localhost:8000](http://localhost:8000). From there, you are free to browse the website as an administrator.

{% capture __alert_content -%}
When asked for the root address of the server, make sure that you use `http://localhost:8000`, as both, protocol _and_ port are required in order for DNS and some pages urls to be displayed correctly.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Staging Your Changes

You’ve made your changes to the codebase, now it’s time to present them to the Sentry developers. It is recommended to first run the test suite locally in order to find any linting, syntax, or integration before you post a Pull Request.

### Running the Test Suite Locally

There are no additional services required for running the Sentry test suite. To install dependent libraries, lint all source code, and run both the Python and JavaScript test suites, simply run:

```bash
make test
```

{% capture __alert_content -%}
If you find yourself constantly running `make test` and wishing it was faster, running either `make test-js` or `make test-python` will only run the test suite with the corresponding language, skipping over linting and dependency checks. If you would like to see even more options, check out other entry points in the `Makefile`.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}
