---
title: 'Documentation Guide'
sidebar_order: 2
---

A part of every development project (especially Open Source projects) is documentation that explains how it works. Sentry and Raven are not any different. Because documentation is a big part of what makes Sentry work we’ve outlined some guidelines about how this documentation is structured and how to extend it.

## Stylistic Choices

These are some general guidelines on the style of the language and text layout:

### Language

The language used in the documentation shall follow American English as much as possible. The exception to that rule are quotations, trademarks or terms that are better known by their British English equivalent.

### Headlines

Capitalization of headlines is always a heavily disputed topic. We generally follow these rules:

-   Headlines are capitalized
-   Words separated by dashes are generally capitalized on the first word only unless it’s a well known term that demands title case (for instance because it’s also known by an acronym). So for instance it’s “Time-series” and “Sans-serif” but “Single Sign-On”
-   A headline must never follow another smaller headline unless there is text in between. If you cannot achieve that, you should leave out one of the headlines.

### The Reader / The Author {#the-reader-the-author}

The documentation prefers “we” to address the author and reader in one go. So for instance “We are going to step through this code snippet.” is a good example of this.

The gender of the reader shall be neutral if possible. Attempt to use “they” as a pronoun for the reader. If that reads bad, “he” is a suitable substitute. Do not use “her” as a pronoun as it confuses non native English readers.

### Paragraphs

Avoid too many short paragraphs in short succession as they read and render terribly. If you end up in a situation where you think you need this, consider using an enumeration instead.

## Documentation Source

The documentation is Markdown format. There are some rules you should follow when editing those files:

For headlines the following styles should be used:

```markdown
# First Level

## Second Level

### Third Level


#### Fourth Level
```

Please do not use more levels than that as they do not display well.
