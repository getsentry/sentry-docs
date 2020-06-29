---
title: Integrating the Backend with the FrontEnd
sidebar_order: 4
---

Now that the Demo App is up and running on your local environment integrated with the Sentry SDK, you're ready to integrate the front and backend together.

> **Note:** If you're using your own source code, follow [Capturing your first event](https://docs.sentry.io/error-reporting/quickstart/?platform=python) to introduce an error to your source code.

## Integrating the Frontend and BackEnd

Integrating the frontend code and backend code is relatively straightforward. This is done through [tracing](https://docs.sentry.io/performance/distributed-tracing/). Using both the frontend app, the `React-demo` and backend app, the `Django-demo`, we can use the tags such as `transaction_id` to integrate tracing.

1. Open up the file `views.py` within the Django Demo app.

2. In the `views.py` file you can see how Sentry is capturing the transactionID.

   - Sentry is making a simple `get` request to get the `X-Transaction-ID`.
     ![Import and Configure SDK]({% asset guides/integrate-backend/capture_transaction_id.png @path %})

3. Once the requests are made and a value is given, we set the `X-Transaction-ID` to custom tags. In our example, we set the tags to be `transaction_id`.

   - **Note:** Please keep the tag fields consistent in both the frontend and backend app.

**Note** The transactionID is generated from the trace. A trace represents the record of the entire operation you want to measure or track. A trace can be a single operation such as performing an action within an app or it can be a lot more in-depth. For example, an action can be committed within the frontend of your app which caused an error and your backend might respond back with an error as well. The trace_id is able to connect both the backend and frontend error together. This is valuable information knowing how the app in entirely connected which can enable a developer to debug both the front

## Reporting an Error

1. Run both the frontend and backend applications at the same time.

   ```bash
   $ make deploy
   ```

   ```bash
   $ npm run deploy
   ```

2. Go to the link `http://localhost:5000/` and add at least 5 items to your cart. After adding the items click the `Checkout` button.

![Import and Configure SDK]({% asset guides/integrate-backend/shopping_website.png @path %})

3. Go to your issues stream, select both the frontend and backend projects, and click on the newest issue.

4. Within the newest issue click on the `transaction_id` and you will be redirected to the Issues Stream with both issues related to one another displayed.

![Import and Configure SDK]({% asset guides/integrate-backend/issue_with_transaction_id.png @path %})
