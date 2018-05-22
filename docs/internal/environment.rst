Development Environment
=======================

Setting up Your Development Environment
---------------------------------------

Linux
''''''''''''''
Just follow the :doc:`official installation from source instructions <../server/installation/python/index>`.

Macintosh OS X
''''''''''''''

To get started, fork the repo at https://github.com/getsentry/sentry and clone it::

    git clone https://github.com/<your github username>/sentry.git
    cd sentry

Install `Homebrew <http://brew.sh>`_, if you haven't already, then run ``brew install python@2``.

It is highly recommended to develop inside a Python virtual environment, so install ``virtualenv``
and ``virtualenvwrapper``::

    pip install virtualenv virtualenvwrapper

Then append the following to your shell profile (e.g. ``~/.bashrc``) and reload it::

    echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc
    exec bash

Setup and activate a Python 2.7 virtual environment in the project root::

    mkvirtualenv sentry

Install ``nvm`` and use it to install the node version specified in the ``.nvmrc`` file::

    brew install nvm
    echo "source /usr/local/opt/nvm/nvm.sh" >> ~/.bashrc
    exec bash
    nvm install

Run the following to install the Python and JavaScript libraries and database services that Sentry
depends on and some extra pieces that hold the development environment together::

    make develop

.. note:: The ``Brewfile`` will install and link a pinned ``postgresql@9.6``, so if you were running
  any older versions, you will need to migrate your old database over to 9.6.

Finally, you'll need to create the ``postgres`` role::

    psql template1 $(whoami) -c 'CREATE USER postgres SUPERUSER;'


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
