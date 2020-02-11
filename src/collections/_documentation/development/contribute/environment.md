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

One thing that requires manual attention is `docker`, which should have just been installed. Open up Spotlight, search for "Docker" and start it. You should soon see the docker icon in your macOS toolbar. Docker will automatically run on system restarts, so this should be the only time you do this.

You can verify that docker is running by running `docker ps`. If it doesn't error with something like `Error response from daemon: dial unix docker.raw.sock: connect: connection refused`, you're good to continue.

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

Sentry also requires a specific version of NodeJS. Like pyenv, we recommend using [volta](https://github.com/volta-cli/volta) to install and manage node versions. Unfortunately, brew doesn't provide volta yet, but installation is quite easy. Run:

```bash
curl https://get.volta.sh | bash
```

The volta installer will conveniently make changes to your shell installation files for you, but it's good to verify. Your `~/.bash_profile` should be the same, but make sure your `~/.bashrc` looks like this:

```bash
eval "$(pyenv init -)"

export VOLTA_HOME="~/.volta"
grep --silent "$VOLTA_HOME/bin" <<< $PATH || export PATH="$VOLTA_HOME/bin:$PATH"
```

Again, reload your shell (or restart your terminal, and cd into sentry):

```bash
PATH= exec /bin/bash -l
```

Now, if you try and run `volta`, you should see some help text. To install node, run:

```bash
volta install node@10.16.3
```

To verify that it worked, running `node -v` should result in `v10.6.3`.

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

The last step is to run `make bootstrap`. This will take a long time, as it basically installs sentry and all of its dependencies, starts up external services, and preps databases.

{% capture __alert_content -%}
`make bootstrap` will run `sentry upgrade`, which will prompt you to create a user. It is recommended to supply the prompts with a proper email address and password. It is also required to designate said user as a **superuser** because said user is responsible for the initial configurations.
{%- endcapture -%}{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}


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

Run either `make test-js` or `make test-python` to run the test suite with the corresponding language. There are also other `test-` targets, refer to the `Makefile`.

Generally, testing is left to continuous integration (travis), or you may directly invoke testing utilities if you need finer granularity e.g. `pytest path/to/specific/test`.
