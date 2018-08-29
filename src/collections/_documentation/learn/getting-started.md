---
title: Getting Started
sidebar_order: 2
---

Sentry is designed to be very simple to get off the ground, yet powerful to
grow into. If you have never used Sentry before, this tutorial will help you
getting started on the platform or your choice.

## Step 1: Sign up for an account

To use Sentry you either need to use a self hosted installation or the cloud
hosted version on sentry.io.  You can [sign up here](https://sentry.io/signup/)
for free for a sentry.io account.

Once you have an account you can create a project and retrieve the DSN, which
is something like an API key for submitting sentry events through our SDKs.

## Step 2: Install your SDK

Sentry supports many languages and platforms for error reporting.  For some
platforms our new unified SDKs are available, for others the SDK usage might
derive slightly from it.  Pick your platform to learn more.

{% include components/platform_content.html content_dir='getting-started-install' %}

## Step 3: Configure the SDK

{% include components/platform_content.html content_dir='getting-started-config' %}

## Relax

With that you're ready to go.  By default the SDKs will automatically capture any
unreported exception as it happens and report it to the project you selected in
Sentry.  However with a bit of extra configuration and and instrumentation you can
unlock many more features.
