---
title: Serverless Decorator
sidebar_order: 9
---

{% version_added 0.7.3 %}

<!-- WIZARD -->
It is recommended to use an [integration for your particular serverless environment if available](/platforms/python/#serverless), as those are easier to use and capture more useful information.

If you use a serverless provider not directly supported by the SDK, you can use this generic integration.

Apply the `serverless_function` decorator to each function that might throw errors:

{% include platforms/python/generic-serverless-example.md %}
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->
{% include platforms/python/generic-serverless-behavior.md %}

