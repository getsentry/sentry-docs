Development Environment
=======================

Setting up Your Development Environment
---------------------------------------

Linux
''''''''''''''
Just follow the :doc:`official installation from source instructions <../server/installation/python/index>`.

Macintosh OS X
''''''''''''''

Third Party Services
~~~~~~~~~~~~~~~~~~~~

To run the basic development server, you need to install both Redis and PostgreSQL.
If you haven't already installed `Mac Homebrew <http://brew.sh>`_, follow the directions
they provide on their homepage. It is an insanely useful package manager for OS X and we
will be using it in this guide.

Redis
*****

Redis is a popular in-memory datastore that Sentry uses for queuing and caching mechanisms.
Run the following to install, configure, and execute Redis as a daemonized server::

    brew install redis
    brew services start redis

PostgreSQL
**********

PostgreSQL is the primary database that Sentry uses for all persistent storage.
Run the following to install, configure, and execute PostgreSQL as a daemonized server::

    brew install postgresql@9.4
    brew services start postgresql@9.4
    brew link --force postgresql@9.4

When installing postgresql using brew you'll have to also create the ``postgres`` role::

    psql template1 $(whoami) -c 'CREATE USER postgres SUPERUSER;'

.. note:: Homebrew by default will want to install version 10.x, which is strongly incompatible with Sentry.


Third Party Libraries
~~~~~~~~~~~~~~~~~~~~~

Sentry depends on a combination of both Python and JavaScript packages that need to be installed
in order for the server to function properly. Below are basic commands to install the languages
and their libraries on OS X.

Python
******

While OS X ships with an acceptable version of Python, installing the latest binaries from Homebrew
is recommended. Run the following to install and configure brewed Python::

    brew install python@2

.. note:: Python 2.7 is required.

Python Virtual Environment
**************************

It is necessary for some functionality in the development environment to be running inside a Python
virtual environment. Run the following to install ``virtualenv`` and ``virtualenvwrapper``::

    pip install virtualenv
    pip install virtualenvwrapper

Then, add the following line to your bash profile::

    source /usr/local/bin/virtualenvwrapper.sh
    export PYTHONDONTWRITEBYTECODE=1 # recommended, but not required


JavaScript
**********

JavaScript is a tad easier because it separates environments already. To install node.js, the
Node Package Manager(npm), and the Yarn Package Manager run::

    brew install nodejs yarn

Installing Libraries
********************

Once all of your dependencies are installed, fork the repo at https://github.com/getsentry/sentry
and clone down a local version::

    git clone https://github.com/<your github username>/sentry.git
    cd sentry

Setup and activate a Python 2.7 virtual environment in the project root::

    mkvirtualenv sentry

Run the following to install both the Python and JavaScript
libraries that Sentry depends on and some extra pieces that hold the development environment
together::

    make develop

.. note:: Some libraries depend on OpenSSL. Install via ``brew install openssl``, and make
  sure to ``export LDFLAGS=-L/usr/local/opt/openssl/lib`` while building, so that the
  ``openssl`` libraries can be found by the build process.

Running the Development Server
------------------------------

Before you are able to run the development server, you first must create a proper database
for it to use. Running the following will create the proper database and fill it with example
data::

    createdb -U postgres -E utf-8 sentry
    sentry init --dev
    sentry upgrade

.. note:: You will be prompted to create a user during ``sentry upgrade``. It is recommended
  to supply the prompts with a proper email address and password. It is also required to
  designate said user as a superuser because said user is responsible for the initial
  configurations.

.. note:: If you would like to import an example dataset, running ``./bin/load-mocks`` will
  add a few example projects and teams to the main organization.


Once you've successfully stood up your datastore, you can now run the development server::

    sentry devserver --workers

.. note:: If you are developing for aesthetics only and do not rely on the async workers,
  you can omit the ``--workers`` flag in order to use less system resources.

.. note:: If you would like to be able to run ``devserver`` outside of your root checkout,
  you can install ``webpack`` globally with ``npm install -g webpack``.

When webpack finishes processing, you can find a login prompt for the user account you previously
created at `<http://localhost:8000>`_. From there, you are free to browse the website as an
administrator.

.. note:: When asked for the root address of the server, make sure that you use ``http://localhost:8000``, as both, protocol *and* port are required in order for DNS and some pages urls to be displayed correctly.

Staging Your Changes
--------------------

You've made your changes to the codebase, now it's time to present them to the Sentry developers.
It is recommended to first run the test suite locally in order to find any linting, syntax, or
integration before you post a Pull Request.

Running the Test Suite Locally
''''''''''''''''''''''''''''''
There are no additional services required for running the Sentry test suite. To install dependent
libraries, lint all source code, and run both the Python and JavaScript test suites, simply run::

    make test

.. note:: If you find yourself constantly running ``make test`` and wishing it was faster, running
  either ``make test-js`` or ``make test-python`` will only run the test suite with the
  corresponding language, skipping over linting and dependency checks. If you would like to see
  even more options, check out other entry points in the ``Makefile``.
