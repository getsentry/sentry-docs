---
title: Alert
arguments:
  - name: content=""
    type: String
    required: true
    desc: Content for the alert
  - name: title=""
    type: String
    required: false
    desc: Title for the alert
  - name: level=""
    type: String
    required: false
    desc: Severity of the alert. Must be a valid [Bootstrap severity level](https://getbootstrap.com/docs/4.0/components/alerts/).
  - name: deep_link=""
    type: String
    required: false
    desc: Slug to use after \# in a URL, to jump to the alert.
examples:
  - title: Basic use
    source: |
      {% include components/alert.html
        content="This is the body of the alert"
      %}
  - title: Full markdown content
    source: |
      {% capture markdown_content %}
      This paragraph explains that it will be followed by a list.

      - This list has three items
      - This is the second item
      - The last item is the best
      {% endcapture %}
      {% include components/alert.html
        content=markdown_content
      %}
  - title: Kitchen sink
    source: |
      {% include components/alert.html
        deep_link="jump-here"
        title="Pay attention"
        content="This is the body of the alert"
        level="danger"
      %}
---

A box with content, with optional colors
