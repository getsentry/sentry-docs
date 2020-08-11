# Sentry Documentation

The Sentry documentation is a static site, generated with [Gatsby][gatsby].

## Getting started

You will need [Volta][volta] installed. If you don't have opinions about the process, this will get you going:

```bash
# Install Homebrew and everything mentioned above
$ bin/bootstrap
```

Once you have the required system dependencies:

```bash
# Install or update application dependencies
$ make
```

Now run the development webserver:

```bash
$ yarn start
```

You will now be able to access docs via http://localhost:3000.

[gatsby]: https://gatsbyjs.org
[volta]: https://volta.sh/

## Markdown Documentation

Documentation is written in Markdown (via Remark) and MDX.

[<kbd>Read the quick reference</kbd>](https://daringfireball.net/projects/markdown/syntax)

## Redirects

Redirects are supported via yaml frontmatter in `.md` and `.mdx` files:

```yaml
---
redirect_from:
  - /performance-monitoring/discover/
---
```

These will be generated as both client-side (using an empty page with a meta tag) and server-side (nginx rules).

## Wizard Pages

A number of pages exist to provide content within Sentry installations. We refer to this system as the _Wizard_. These pages are found in Gatsby's `wizard` content directory, and are rendered and exported to a JSON file for use within the `getsentry/sentry` application.

Each page consists of some wizard-specific frontmatter, as well as a markdown body:

```markdown
---
name: Platform Name
doc_url: Permalink for this page
type: framework
support_level: production
---

This is my  content.
```

## Notes on Markdown vs MDX

:pray: that MDX v2 fixes this.

MDX has its flaws. When rendering components, any text inside of them is treated as raw text (_not_ markdown). To work around this you can use the `<markdown>` tag, but it also has its issues. Generally speaking, put an empty line after the opening tag, and before the closing tag.

```jsx
// don't do this as parsing will hit weird breakages
<markdown>
foo bar
</markdown>
```

```jsx
// do this
<markdown>

foo bar

</markdown>
```
