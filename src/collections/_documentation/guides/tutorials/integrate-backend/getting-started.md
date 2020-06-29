---
title: Getting Started
sidebar_order: 1
---

In this tutorial, you will import the backend app source code into your local development environment, add the Sentry SDK and initialize it. **Please** view the [frontend guide](https://docs.sentry.io/guides/integrate-frontend/create-new-project/) to learn more about how to create a project and alert rules.

> **Note:** If you're using your own source code you can skip this tutorial and instead
>
> - Follow the instructions within [this doc](https://docs.sentry.io/error-reporting/quickstart/?platform=python). Notice that you can select the desired platform.
> - Continue with the [Next tutorial]({%- link _documentation/guides/tutorials/integrate-frontend/generate-first-error.md -%})

---

## Prerequisites

The demo app source code requires a **Python** development environment to build install and run the application. Make sure that you have the following in place:

- A source code editor (like [VS-Code](https://code.visualstudio.com))
- [Python3](https://www.python.org/download/releases/3.0/)
- [Sentry-Cli](https://docs.sentry.io/cli/)
- [NPM](https://www.npmjs.com/)

## Step 1: Get the Code

1. Open the sample [code repository](https://github.com/sentry-tutorials/backend-monitoring) on GitHub

2. Click on `Fork` and select the target GitHub account you wish this repository to be forked in to

   ![Fork Repository]({% asset guides/integrate-backend/fork_django.png @path %})

3. Once the fork is complete, click on `Clone or download` and copy the repository HTTPS URL

   ![Clone Repository]({% asset guides/integrate-backend/clone_django.png @path %})

4. Clone the forked repository to your local environment

   ```bash
   > git clone <repository HTTPS url>
   ```

5. Now that the sample code is available locally, open the `backend-monitoring` project in your preferred code editor

## Step 2: Install the SDK

Sentry captures data by using a platform-specific SDK within your application runtime. To use the SDK, import and configure it in your source code.

The demo project uses Django for the backend code and REACT for the frontend code. Please refer to the [frontend guide]({%- link _documentation/guides/tutorials/integrate-frontend/index.md -%}) on how to set up your front end code.

Refer to the [doc](https://docs.sentry.io/error-reporting/quickstart/?platform=python) on how to get started.

1. Open the `settings.py` file (located under \_./backend-monitoring/myproject/settings.py). This is where we initialize and configure the Sentry SDK in our application.

   <!-- ![Import and Configure SDK]({% asset guides/integrate-backend/sentry_init.png @path %}) -->

2. After importing the Sentry SDK to the app, it is important to import the Sentry Django integration as well. Integrations extend the functionality of the SDK for some common frameworks and libraries.

   ```python
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
   ```

3. In the Sentry SDK configuration, enter the `dsn` key value you copied from the project created in the previous tutorial.

   ```python
   sentry_sdk.init(
       dsn="YOUR_DSN",
       integrations=[DjangoIntegration()]
   )
   ```

## Step 3: Install Dependencies & Run the Demo App

To build and run the Demo application on your localhost

1. Open a shell terminal and change directory to the `django` project folder

2. Install Python3 if you haven't already by running the following:

   ```bash
    brew install python3
   ```

3. Install virtualenv and virtualenvwrapper:

   ```bash
    pip3 install virtualenv virtualenvwrapper
    echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc
    exec bash
   ```

4. Install Sentry's command line tool to use release tracking and GitHub integration for commit data:

   ```bash
    npm install -g @sentry/cli
   ```

5. Setup and activate a Python 3 virtual environment in the project root.

   > (You can name the virtual environment whatever you feel that is appropriate, in our case we named it sentry-demo-django)

   ```bash
    mkvirtualenv --python=python3 sentry-demo-django
   ```

6. To activate the virtual environment run:

   ```bash
    workon sentry-demo-django
   ```

7. Running the following command will install relevant python libraries and run django server

   ```bash
    make deploy
   ```

   ![Deploy & Serve]({% asset guides/integrate-backend/run_django_server.png @path %})

   > Once the deploy finishes successfully, you'll see the confirmation in your terminal

## Next

[Configuration Options]({%- link _documentation/guides/tutorials/integrate-backend/configuration_options.md -%})
