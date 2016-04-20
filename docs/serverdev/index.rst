Contributing to Sentry
======================

This part of the documentation guides you towards contributing to `Sentry <https://www.github.com/getsentry/sentry>`_.
It covers the installation and configuration of required dependencies, as well as
standard procedures of contribution.

Setting up Your Development Environment
---------------------------------------

Macintosh OSX
'''''''''''''

Third Party Services
~~~~~~~~~~~~~~~~~~~~
To run the basic development server, you need to install both Redis and Postgresql.
Below are basic commands to install them on OSX. By now, you hopefully have Homebrew installed.
If you don't run::

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

.. note:: If you would like to have the following services run when you start your machine,
  follow the instructions that Homeberw provides at the end of running ``install``.

Redis
*****
Redis is a popular in-memory datastore that Sentry uses for queuing and caching mechanisms.
Run the following to install, configure, and execute Redis as a daemonized server::

    brew install redis
    redis-server --save --daemonize yes

Postgresql
**********
Postgresql is the primary database that Sentry uses for all persistent storage.
Run the following to install, configure, and execute Postgresql as a daemonized server::

    brew install postgresql
    pg_ctl -D /usr/local/var/postgres start

Third Party Libraries
~~~~~~~~~~~~~~~~~~~~~
Sentry depends on a combination of both Python and JavaScript packages that need to be installed
in order for the server to function properly. Below are basic commands to install the languages
and their libraries on OSX.

Python
******
While OSX ships with an acceptable version of Python, installing the latest binaries from HomeBrew
is recommended. In addition, it is highly recommended to separate your libraries per-environment
with the use of virtual environments. One of the easiest ways to curate your virtual environments is
with `virtualenvwrapper <https://virtualenvwrapper.readthedocs.org/>`_. Run the following to install
and configure brewed Python and virtualenvwrapper::

    brew install python
    pip install virtualenvwrapper
    touch ~/.bashrc >> source /usr/local/bin/virtualenvwrapper.sh
    source ~/.bashrc
    mkvirtualenv sentry

JavaScript
**********
JavaScript is a tad easier because it separates environments already. To install node.js and
the Node Package Manager(npm) run::

    brew install nodejs

Installing Libraries
********************
Once all of your dependencies are installed, head over to the root of ``getsentry/sentry``.
Run the following to install both the Python and JavaScript libraries that Sentry depends on
and some extra pieces that hold the development environment together::

    make develop

Running the Development Server
------------------------------
Before you are able to run the development server, you first must create a proper database
for it to use. Running the following will create the proper database and fill it with example
data::

    createdb -E utf-8 sentry
    sentry init
    sentry upgrade
    ./bin/load-mocks

.. note:: You will be prompted to create a user during ``sentry upgrade``. It is recommended
  to supply the prompts with a proper email address and password. It is also recommended to
  designate said user as a superuser.

Once you've successfully stood up your dataset, you can now run the development server::

    sentry devserver

.. note:: If you would like to be able to run ``devserver`` outside of your root checkout,
  you can install ``webpack`` globally with ``npm install -g webpack``.

When webpack finishes processing, you can find a login prompt for the user account you previously
created at `<http://localhost:8000>`_. From there, you are free to browse the website as an
administrator.

Staging Your Changes
--------------------
You've made your changes to the codebase, now it's time to present them to the Sentry developers.
It is recommended to first run the test suite locally in order to find any linting, syntax, or
integration before you post a Pull Request.

Code Coverage
'''''''''''''
#TODO Should this even be here?#

Running the Test Suite Locally
''''''''''''''''''''''''''''''
There are no additional services required for running the Sentry test suite. To install dependent
libraries, lint all source code, and run both the Python and JavaScript test suites, simply run::

    make test

.. note:: If you find yourself constantly running ``make test`` and wishing it was faster, check
  out other entry points for testing in the ``Makefile``.

Posting a Pull Request
''''''''''''''''''''''
If your test suite run has completed successfully or you wish to run it in Travis CI in order to
weed out any inconsistency problems, now is the right time to post a Pull Request(abbreviated as PR).
In your PR, please provide a quick description as to what it is fixing or providing.
If your PR is related to a topic that a certain team should be aware of, please tag said team at
the bottom of the description. A list of teams can be found `here <https://github.com/orgs/getsentry/teams>`_.
If you are not part of the Sentry organization, please #TODO what should we have here?#.

