---
title: Release Health Glossary
sidebar_order: 1
---

## Session

The time when the user is interacting with the application. (The application is in foreground)

- Session begins with the start of the application. Or, it begins with bringing the already started application back from background to the foreground.
- Session ends with the closing of the application or with the application being sent to the background.
- If the application is in the background for less than 30 seconds, we do not need to start the session again.
- Applications that are active even on the background (for example, music player) should track the sessions separately for the background process.

## Active Users

Number of users that started the application at least once in the specified time period.

## Crash

The fatal error that caused the crash of the application. Errors that did not cause the end of the application should not be included.

## Crash Free User

Percentage of the users that did not experience a crash during the specified time period.

## Crash Free Sessions

Number of sessions in the specified time range that did not end by the crash of the application.

## Crashed Users

Number of users that experienced a crash in the specified time range.

## Release Adoption

Number of users that started at least once during the specified time period of a specific release

## Release Version

A shorter version of the name = name without the package or short version of the hash
