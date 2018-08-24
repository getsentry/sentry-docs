---
title: Integrations
---

Integrations extend the functionality of Raven.js to cover common libraries and environments automatically using simple plugins.

## What are plugins? {#what-are-plugins}

In Raven.js, plugins are little snippets of code to augment functionality for a specific application/framework. It is highly recommended to checkout the list of plugins and use what apply to your project.

In order to keep the core small, we have opted to only include the most basic functionality by default, and you can pick and choose which plugins are applicable for you.

## Why are plugins needed at all? {#why-are-plugins-needed-at-all}

JavaScript is pretty restrictive when it comes to exception handling, and there are a lot of things that make it difficult to get relevent information, so it’s important that we inject code and wrap things magically so we can extract what we need. See [_Usage_]({%- link _documentation/clients/javascript/usage.md -%}) for tips regarding that.

## Installation

To install a plugin just include the plugin **after** Raven has been loaded and the Raven global variable is registered. This happens automatically if you install from a CDN with the required plugins in the URL.

-   [AngularJS]({%- link _documentation/clients/javascript/integrations/angularjs.md -%})
-   [Angular]({%- link _documentation/clients/javascript/integrations/angular.md -%})
-   [Backbone]({%- link _documentation/clients/javascript/integrations/backbone.md -%})
-   [Ember]({%- link _documentation/clients/javascript/integrations/ember.md -%})
-   [React]({%- link _documentation/clients/javascript/integrations/react.md -%})
-   [Vue.js (2.0)]({%- link _documentation/clients/javascript/integrations/vue.md -%})
