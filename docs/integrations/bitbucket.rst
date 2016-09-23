Bitbucket
=========

Sentry integrates with both Bitbucket Issues and Pipelines.


Set up Bitbucket Issue creation in Sentry
`````````````````````````````````````````

1. Go to the project settings page in Sentry that you'd like to link with Bitbucket
2. Click All Integrations, find the Bitbucket integration in the list, and click configure
3. Click Enable Plugin
4. Fill in the required information and save
5. The option to create Bitbucket issues will be displayed from your Sentry issue pages

Set up release tracking with Bitbucket Pipelines
````````````````````````````````````````````````

1. Go to the organizations settings page in Sentry
2. Click API Keys, New API Key to create a key with 'project:releases' permissions.
3. Go to Bitbucket and enable Bitbucket Pipelines
4. Create a `bitbucket-pipelines.yml` config at the base level of your repository and add a step that issues a POST request (with the Sentry API key generated in step 2) to Sentry's release endpoint

Still lost? Look through `this example repo <https://bitbucket.org/getsentry/demo-pipelines>`_ for more ideas.
