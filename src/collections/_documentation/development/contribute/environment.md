---
title: 'Development Environment'
sidebar_order: 1
---

## Setting up Your Development Environment

### Linux

Follow [the Docker file in the repository](https://github.com/getsentry/sentry/blob/master/docker/Dockerfile) but instead of creating and installing a wheel, install the package in editable mode (`pip install . -e`).

### Macintosh OS X

To get started, fork the repo at [https://github.com/getsentry/sentry](https://github.com/getsentry/sentry). Clone your forked repo and go into it:

```bash
git clone https://github.com/<your github username>/sentry.git
cd sentry
```

It's important that you remain in the repo's root directory for the rest of the setup!

Install [Homebrew](http://brew.sh), and then run `brew bundle` to install the various system packages as listed in sentry's `Brewfile`.

Unfortunately, homebrew recently removed Python 2. While some versions of macOS ship with Python 2, it's recommended to not use the system's installation. Sentry also requires a specific version of Python, as shown in the file `.python-version`, and this may differ from the system's Python.

We recommend using [pyenv](https://github.com/pyenv/pyenv) to install and manage python versions. It should have already been installed earlier when you ran `brew bundle`. But you'll need to make some manual changes to your shell initialization files.

Make sure your `~/.bash_profile` contains the following:

```bash
source ~/.bashrc
```

And your `~/.bashrc`:

```bash
eval "$(pyenv init -)"
```

Now, if you try and run `pyenv`, you'll probably get a command not found. Your shell needs to be reloaded. You can either reload it in-place, or close your terminal and start it again and cd into sentry. To reload it, run:

```bash
PATH= exec /bin/bash -l
```

If it worked, you should be able to run `pyenv` and see some help output.

Finally, to install python, run `pyenv install`. This will take a while, since your computer is actually compiling python! To verify everything worked, running `which python` should result in something like `/Users/you/.pyenv/shims/python`.

You're now ready to create a virtual environment. Run:

```bash
python -m pip install virtualenv
python -m virtualenv .venv
```

And activate the virtual environment:

```bash
source .venv/bin/activate
```

If everything worked, running `which python` should now result in something like `/Users/you/whereever-you-cloned-sentry/.venv/bin/python`.

--------------

Install `nvm` and use it to install the node version specified in sentry's `.nvmrc` file:

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
  level="warning"
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
  level="info"
%}

Once you’ve successfully stood up your datastore, you can now run the development server:

```bash
sentry devserver --workers
```

If you are developing for aesthetics only and do not rely on the async workers, you can omit the `--workers` flag in order to use less system resources.

If you would like to be able to run `devserver` outside of your root checkout, you can install `webpack` globally with `npm install -g webpack`.

When webpack finishes processing, you can find a login prompt for the user account you previously created at [http://localhost:8000](http://localhost:8000). From there, you are free to browse the website as an administrator.

{% capture __alert_content -%}
When asked for the root address of the server, make sure that you use `http://localhost:8000`, as both, protocol _and_ port are required in order for DNS and some pages urls to be displayed correctly.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

## Staging Your Changes

You’ve made your changes to the codebase, now it’s time to present them to the Sentry developers. It is recommended to first run the test suite locally in order to find any linting, syntax, or integration before you post a Pull Request.

### Running the Test Suite Locally

There are no additional services required for running the Sentry test suite. To install dependent libraries, lint all source code, and run both the Python and JavaScript test suites, simply run:

```bash
make test
```

If you find yourself constantly running `make test` and wishing it was faster, running either `make test-js` or `make test-python` will only run the test suite with the corresponding language, skipping over linting and dependency checks. If you would like to see even more options, check out other entry points in the `Makefile`.
