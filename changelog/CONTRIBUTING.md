<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <picture>
      <source srcset="https://sentry-brand.storage.googleapis.com/sentry-logo-white.png" media="(prefers-color-scheme: dark)" />
      <source srcset="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)" />
      <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" alt="Sentry" width="280">
    </picture>
  </a>
</p>

_Bad software is everywhere, and we're tired of it. Sentry is on a mission to help developers write better software faster, so we can get back to enjoying technology. 
If you want to join us [<kbd>**Check out our open positions**</kbd>](https://sentry.io/careers/)_

### Sentry's Changelog
Sentry's changelog is a site to promote recent changes to Sentry's product, new releases in SDKs, and any other new goings ons which think might
tickle our user's interests.

### Contributing
This guide is only to instruct how to add or edit entries to the changelog. You only need a GitHub account and the ability to edit this repo
via the browser, or by checking out the repo and making your edits locally. You can then create a PR which should be reviewed and merged.

### Create a New Entry

Create a new file in sentry-docs/changelog/. [Follow this link](https://github.com/getsentry/sentry-docs/new/smeubank-changelog-contribution/changelog?filename=YYYY-MM-title-of-post.mdx) to create a new mark down file. Then ensure the naming of the file follows this convention ```YYYY-MM-DD-title-of-post.mdx```, and update to the current date and a snazzy title of your choosing. You can then copy and paste the following template into the empty markdown file to begin crafting your chagelog post.


```
  ---
  title: "Title of your awesome ship here"
  summary: "Summary of your awesome ship here"
  date: "2023-10-12T00:00:00.000Z"
  tags: ["SDK","Crons","Ruby"]
  ---

  Content of your awesome ship here. `codeCase` example, and a line \
  \
  break.\
  \
  Here is a [sick hyperlink](https://changelog.sentry.io)

 

```

It is important to note that the tags used should be from the following list: 
```SDKS```,
```CRONS```,
```ISSUES```,
```UI/UX-UPDATE```,
```REPLAY```,
```JAVASCRIPT```,
```NODE```,
```PERFORMANCE```,
```ANDROID```,
```MOBILE```,
```BETA```,
```PROFILING```,
```PYTHON```,
```IOS```,
```PHP```,
```ERRORS```,
```INTEGRATIONS```,
```CODE-COVERAGE```,
```RUBY```,
```ENTERPRISE```,
```DASHBOARDS```, and
```BILLING```
