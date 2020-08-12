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

## Search

Search is powered by Algolia, and will index all content in /docs/ that is Markdown or MDX formatted.

It will _not_ index documents with any of the following in their frontmatter:

- `draft: true`
- `noindex: true`
- `robots: noindex`

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

## Creating new SDK docs

If you want to create new docs for SDKs you should start by choosing an SDK to copy from and change the parts necessary. Start by calling

```bash
yarn sdk:copy javascript angular
```

This for example will take the `src/sdks/javascript` content and symlink everything into `src/sdks/angular`.
Since all the files are symlinks the content will be the same. Files that have different content in the new folder need to be deleted and created manually again to be able to change the content. If you change something in the symlink it will change the original file.

Also open `src/components/sidebar.js` search for a variable named: `newSdkDocs` which should look something like this

```javascript
const newSdkDocs = ['javascript', 'angular'];
```

This will add the newly created SDK docs to the sidebar.