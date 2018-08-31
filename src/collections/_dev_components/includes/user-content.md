---
title: User Content
examples:
  - title: Basic use
    desc: |
      {% include components/alert.html content="Do not copy and paste from this example. It contains invisible characters that prevent the tokens from rendering." %}
    source: |
      ```javascript
      console.log("Your DSN is _⁣__DSN___")
      ```
    output: |
      ```javascript
      console.log("Your DSN is ___DSN___")
      ```
---

It is possible to display a user's actual configuration information within code samples. This is done using one of the following keys:

<div data-user-token-list></div>

This feature only works within block level code examples, which are created using tripple tick <code>```</code> fenced code blocks in Markdown or using Jekyll's `highlight` tag.
