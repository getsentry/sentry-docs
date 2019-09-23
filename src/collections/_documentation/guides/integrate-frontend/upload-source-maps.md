---
title: Enable Readable Stack-traces in your Errors
sidebar_order: 4
---

 A `release version` is a dynamic identifier that changes whenever you ship a new version of your code. When you give Sentry information about your releases, you unlock a number of features and allow JavaScript and iOS Sentry projects to proactively unminify or symbolicate your error stack traces. Check out our documentation to learn more about [Releases](https://docs.sentry.io/workflow/releases/?platform=browser)



## Description & Objectives
 Releases are used for applying `source maps` to minified JavaScript to view original, untransformed source code in the stack traces of errors associated with the respective release. This is particularly useful for debugging minified code (e.g. UglifyJS), or transpiled code from a higher-level language (e.g. TypeScript, ES6).

 In this tutorial we will: 
 1. Utilize the `Sentry Command Line Interface` (CLI) **during the build process** to update your Sentry account by:
    - Creating a new release version
    - Uploading the project's latest source maps (and associate them with the new release version)
2. Add the release version to the Sentry SDK configuration - this will associate any error captured by the SDK in our app to this specific release. Sentry will use the release's source maps we uploaded to un-minify the error's stack-trace.

**Note:** As part of the **CI/CD workflow** for this app demo we're using a `Makefile` to handle the `sentry-cli` related tasks through make tasks (targets). If you're using a different code base you can still apply the settings and commands described below to your specific setup or run them directly in a command line shell. Click here for more information on working with the [Command Line Interface](https://docs.sentry.io/cli/)


<!-- ## Prerequisites -->

## Step 1: Prepare the Build Environment
We will use the `Makefile` in `sentry-react-demo` project to handle Sentry related tasks utilizing the `sentry-cli`. The CLI is already available through the project dependencies (see `package.json`) and requires several parameters to be available in order to run.

1. Open the `Makefile`

2. Uncomment the commented environment variables `SENTRY_AUTH_TOKEN` , `SENTRY_ORG`, and `SENTRY_PROJECT` (remove the leading **#**)
    
    ![Initial Makefile]({% asset guides/integrate-frontend/upload-source-maps-010.png @path %})
    

3. To find the SENTRY_ORG and SENTRY_PROJECT values
    - Open your Sentry account and click **Projects**
    - Your Organization ID is part of the browser URL (https://sentry.io/organizations/**SENTRY_ORG**/issues/?project=1523617)
    - The SENTRY_PROJECT value is the name that appears in the project tile
        
        ![Sentry CLI variables]({% asset guides/integrate-frontend/upload-source-maps-011.png @path %})
    - Copy the values and paste them in the Makefile

4. To create a `SENTRY_AUTH_TOKEN`, click on the Company Org name from the top of the left side panel to open the Org and User Settings
    - Select `API Keys`
    - Click on `Create New Token` from the Auth Tokens page 
        
        ![Create Auth Token 1]({% asset guides/integrate-frontend/upload-source-maps-04.png @path %})
    
    - Accept the selected token scopes and click `Create Token`
        
        ![Create Auth Token 2]({% asset guides/integrate-frontend/upload-source-maps-05.png @path %})

    - Once the token is created, click on the copy icon to copy the token value and paste it in the Makefile

        ![Create Auth Token 3]({% asset guides/integrate-frontend/upload-source-maps-06.png @path %})


5. The Makefile should look like this:

    ![Sentry CLI variables]({% asset guides/integrate-frontend/upload-source-maps-012.png @path %})


***

## Step 2: Create a Release & Upload Source Maps

Now we can invoke the `sentry-cli` to let Sentry know we have a new release and upload the project's source maps to it. 
- You can set a custom release version to suit your own delivery processes or let the Sentry CLI calculate and generate a version. 
- To build the `sentry-react-demo` project we use the `react-scripts` package that also generates source maps under _./build/static/js/_

1. In the Makefile, add a new environment variable for the release version, utilizing Sentry CLI to propose the version value

    ```bash
    REACT_APP_RELEASE_VERSION=`sentry-cli releases propose-version`
    ```

2. At the bottom of the Makefile, paste the following targets utilizing the Sentry CLI to:
    - Create a new release (object) in your Sentry account
    - Upload the project's source maps to the new release 
    
    ```bash
    create_release:
        sentry-cli releases -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(REACT_APP_RELEASE_VERSION)


    upload_sourcemaps:
        sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) files $(REACT_APP_RELEASE_VERSION) \
            upload-sourcemaps --url-prefix "~/static/js" --validate build/static/js
    ```

    The Makefile contains a `setup_release` target that is invoked from the `package.json` file when running  `$ npm run deploy ` to build and run the project.  We'll use this target to invoke all the release related tasks.

3. Replace the existing `setup_release` with 

    ```Shell
    setup_release: create_release upload_sourcemaps
    ```

    Your Makefile should look like this:
        
    ![Makefile with Release]({% asset guides/integrate-frontend/upload-source-maps-03.png @path %})


    Now that you created a release version, you can associate any errors captured in your app to that release through the SDK.

4. Open the `index.html` file and add a new configuration option to the SDK: 
    
    Assign the release version environment variable to the `release` key


    ```JavaScript
    Sentry.init({
        dsn: '<YOUR DSN KEY>',
        release: "%REACT_APP_RELEASE_VERSION%"
    });
    ```
    
    > **Note:** the release version environment variable is set in the project.json during build time and is injected into the generated markup.

***


## Step 3: Try your Change - Generate Another Error

1. If your terminal is still serving the demo app on localhost, click `^C` to shutdown the local server

2.  Build, deploy and run the project again by running:
    
    ```Node
    $ npm run deploy
    ```
    
3. Take a look at the terminal log. Notice that the minified scripts and source maps were uploaded to the release version.

    ![Release Created]({% asset guides/integrate-frontend/upload-source-maps-07.png @path %})

4. In your browser, make sure that the dev console is open and perform an **Empty Cache and Hard Reload** to make sure the updated code is being served.
    
    ![Release Created]({% asset guides/integrate-frontend/upload-source-maps-08.png @path %})

5. Generate the error again by adding products to your cart and clicking **Checkout**

6. Check your Email for the alert about the new error and click **View on Sentry** to open the issue page

7. Notice that the error stack trace is now available 
    
    ![Release Created]({% asset guides/integrate-frontend/upload-source-maps-09.png @path %})

## Step 4: Explore the Release

Creating a release version and uploading the source maps through the Sentry SLI, creates a **Release** object in your Sentry account.

1. Click on `Releases` from the left side panel, notice that a new release version was created 

    ![Release Created]({% asset guides/integrate-frontend/upload-source-maps-013.png @path %})
    

2. Click on the release, notice that the error in your app has been associated with this release and is listed as a **New Issue in this Release** 

    ![Release Created]({% asset guides/integrate-frontend/upload-source-maps-014.png @path %})

3. Click on the `Artifacts` tab, notice the minified resources and source maps are available for this release and will be used to un-minify error stack traces

    ![Release Created]({% asset guides/integrate-frontend/upload-source-maps-015.png @path %})

****



## Next
Now that we have all the information we need about the error and a clear stack-trace, the next thing is to assign the right developer to handle it. 

[Integrate your Source Code Repository]({%- link _documentation/guides/integrate-frontend/configure-scms.md -%})

