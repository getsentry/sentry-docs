---
title: 'Development Environment'
sidebar_order: 1
---

## Setting up Your Development Environment

### Linux

Follow [the Docker file in the repository](https://github.com/getsentry/sentry/blob/master/docker/Dockerfile) but instead of creating and installing a wheel, install the package in editable mode (`pip install . -e`).

### macOS

{% capture __alert_content -%}
macOS Catalina will recommend that you use the zsh shell, instead of bash. While the differences are minimal, this guide only covers bash, so for best results please use bash. You can verify this by typing `echo $SHELL`, which should result in `/bin/bash`.

{%- endcapture -%}{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

To get started, fork the repo at [https://github.com/getsentry/sentry](https://github.com/getsentry/sentry). Clone your forked repo and go into it:

```bash
git clone https://github.com/<your github username>/sentry.git
cd sentry
```

{% capture __alert_content -%}
It's important that you remain in the repo's root directory for the rest of the setup! Also, please do the following steps in the exact order they're shown.
{%- endcapture -%}{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}


### macOS - System Dependencies

Install [Homebrew](http://brew.sh), and then run `brew bundle` to install the various system packages as listed in sentry's `Brewfile`.

One thing that requires manual attention is `docker`, which should have just been installed. Open up Spotlight, search for "Docker" and start it. You should soon see the docker icon in your macOS toolbar. Docker will automatically run on system restarts, so this should be the only time you do this.

You can verify that docker is running by running `docker ps`. If it doesn't error with something like `Error response from daemon: dial unix docker.raw.sock: connect: connection refused`, you're good to continue.


### macOS - Python

Unfortunately, homebrew recently removed Python 2. While some versions of macOS ship with Python 2, it's recommended to not use the system's installation. Sentry also requires a specific version of Python, as shown in the file `.python-version`, and this may differ from the system's python.

We recommend using [pyenv](https://github.com/pyenv/pyenv) to install and manage python versions. It should have already been installed earlier when you ran `brew bundle`.

You should be able to install python by running `pyenv install`. This will take a while, since your computer is actually compiling python!

After this, if you type `which python`, you should see something like `/usr/bin/python`... this means `python` will resolve to the system's python. You'll need to make some manual changes to your shell initialization files, if you want your shell to see pyenv's python.

Make sure your `~/.bash_profile` contains the following:

```bash
source ~/.bashrc
```

And your `~/.bashrc`:

```bash
eval "$(pyenv init -)"
```

Once that's done, your shell needs to be reloaded. You can either reload it in-place, or close your terminal and start it again and cd into sentry. To reload it, run:

```bash
PATH="" exec /bin/bash -l
```

If it worked, running `which python` should result in something like `/Users/you/.pyenv/shims/python`.


### macOS - NodeJS

Sentry also requires a specific version of NodeJS. Like pyenv, we recommend using [volta](https://github.com/volta-cli/volta) to install and manage node versions. Unfortunately, brew doesn't provide volta yet, but installation is quite easy. Run:

```bash
curl https://get.volta.sh | bash
```

The volta installer will tell you to "open a new terminal to start using Volta", but you don't have to! You can just reload your shell like before:

```bash
PATH="" exec /bin/bash -l
```

This works because the volta installer conveniently made changes to your shell installation files for you, but it's good to verify. Your `~/.bash_profile` should be the same, but make sure your `~/.bashrc` looks like this:

```bash
eval "$(pyenv init -)"

export VOLTA_HOME="~/.volta"
grep --silent "$VOLTA_HOME/bin" <<< $PATH || export PATH="$VOLTA_HOME/bin:$PATH"
```

Now, if you try and run `volta`, you should see some help text, meaning volta is installed correctly. To install node, simply run:

```bash
node -v
```

Volta intercepts this and automatically downloads and installs the node version in sentry's `package.json`.


### macOS - Python (virtual environment)

You're now ready to create a python virtual environment. Run:

```bash
python -m pip install virtualenv
python -m virtualenv .venv
```

And activate the virtual environment:

```bash
source .venv/bin/activate
```

If everything worked, running `which python` should now result in something like `/Users/you/whereever-you-cloned-sentry/.venv/bin/python`.


### macOS - Final Bootstrap

The last step is to run `make bootstrap`. This will take a long time, as it basically installs sentry and all of its dependencies, starts up external services, and preps databases.

{% capture __alert_content -%}
`make bootstrap` will run `sentry upgrade`, which will prompt you to create a user. It is recommended to supply the prompts with a proper email address and password. It is also required to designate said user as a **superuser** because said user is responsible for the initial configurations.
{%- endcapture -%}{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}


### macOS - direnv (optional, but recommended)

We have a [direnv](https://github.com/direnv/direnv) configuration for Sentry. It automatically sets some helpful environment variables for you, automatically activates your virtual environment, and does some simple state checking to guide you towards the expected development environment.

To install it, run `brew install direnv`. You'll want to add this to the end of your `~/.bashrc` file:

```bash
eval "$(direnv hook bash)"
```

And after doing that, reload your shell:

```bash
PATH="" exec /bin/bash -l
```

Now, direnv should automatically execute (or you might need to type `direnv allow`). If you've followed this guide correctly, it should succeed.


## Running the Development Server

{% capture __alert_content -%}
If you would like to import an example dataset, running `./bin/load-mocks` will add a few example projects and teams to the main organization.
{%- endcapture -%}
{%- include components/alert.html
  title="Tip!"
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

Run either `make test-js` or `make test-python` to run the test suite with the corresponding language. There are also other `test-` targets, refer to the `Makefile`.

Generally, testing is left to continuous integration (travis), or you may directly invoke testing utilities if you need finer granularity e.g. `pytest path/to/specific/test`.
