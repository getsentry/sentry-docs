---
title: version_added
arguments:
  - name: first
    type: String
    required: true
    desc: Text that will be prepended with "New in" and wrapped in parenthesis
examples:
  - title: Basic use
    source: "{% version_added 8.4 %}"
---

Insert a note about when a feature was added.
