---
title: Introduce Sentry SDK to your Frontend Code
sidebar_order: 2
---

In this tutorial, you import the React demo code into your local development environment, add the Sentry SDK, and initialize it.

> **Note:** If you're using your own source code you can skip this tutorial and instead
>
> * Follow the instructions on [Getting Started](https://docs.sentry.io/error-reporting/quickstart/?platform=browser). Notice that you can select the desired platform. 
> * Continue with the [Next tutorial]({%- link _documentation/guides/integrate-frontend/generate-first-error.md -%}).

## Prerequisites

The demo app source code requires a **NodeJS** development environment to install and run the application. Make sure that you have the following in place:

- [Node and NPM](https://nodejs.org/en/)
- [NVM](https://github.com/nvm-sh/nvm)

## Step 1: Get the Code

1. Open the sample [code repository](https://github.com/idosun/sentry-react-demo) on GitHub

2. Click on `Fork` and select the target GitHub account you wish this repository to be forked in to

    ![Fork Repository]({% asset guides/integrate-frontend/initialize-sentry-sdk-01.png @path %})

3. Once the fork is complete, click on `Clone or download`, and copy the repository HTTPS URL

    ![Clone Repository]({% asset guides/integrate-frontend/initialize-sentry-sdk-02.png @path %})

4. Clone the forked repository to your local environment

    ```bash
    > git clone <repository HTTPS url>
    ```

5. Now that the sample code is available locally open the `sentry-react-demo` project in your preferred code editor

## Step 2: Install the SDK

Sentry captures data by using a platform-specific SDK within your application runtime. To use the SDK, import and configure it in your source code.

The demo project uses React and Browser JS. The quickest way to get started is by using the CDN hosted version of the JavaScript browser SDK, however, you can [NPM install](https://docs.sentry.io/error-reporting/quickstart/?platform=browsernpm) the browser library as well.

1. Open the `index.html` file (located under _./sentry-react-demo/public/_)

    ![Import and Configure SDK]({% asset guides/integrate-frontend/initialize-sentry-sdk-03.png @path %})
    
    > Notice that we import the JavaScript browser SDK and initialize it as early as possible in our code. When initializing the SDK, we provide the desired configuration. The only mandatory key is the **DSN**.

2. In the Sentry SDK configuration, enter the `DSN` key value you copied from the project created in the previous tutorial. 

    ```javascript
    Sentry.init({
        dsn: '<PASTE YOUR DSN KEY HERE>'
    });
    ```

    > Besides the `DSN`, the SDK configuration supports multiple other options. Take a look at our [Configuration](https://docs.sentry.io/error-reporting/configuration) documentation for more information.

## Step 3: Install & Run the Demo App

To build and run the Demo application on your localhost:

1. Open a shell terminal and change directory to the `sentry-react-demo` project folder

2. Use the `.nvmrc` file to set the Node version compatible with this project. Run:
     ```bash
    > nvm use
    ```

3. Install project dependencies by running:

     ```bash
    > npm install
    ```

4. Build, deploy, and run the project on your localhost by running:

     ```bash
    > npm run deploy
    ```

    ![Deploy & Serve]({% asset guides/integrate-frontend/initialize-sentry-sdk-04.png @path %})
    > Once the deploy finishes successfully, you'll see the confirmation in your terminal 

***

## Next

[Capture your First Error]({%- link _documentation/guides/integrate-frontend/generate-first-error.md -%})
