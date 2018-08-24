---
title: Alert
source: components/alert.html
---

- `title="note"` _(optional)_ Title for the alert
- `content=""` _(required)_ Content for the alert
- `level="warning"` _(optional)_ Severity of the alert. Must be a valid [Bootstrap severity level][bs-alert].

<hr>

### Basic use

#### Source

```liquid
{% raw %}{% include components/alert.html
  content="This is the body of the alert"
%}{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
  {% include components/alert.html
    content="This is the body of the alert"
  %}
</div>

### Full markdown content

#### Source

```liquid
{% raw %}{% capture markdown_content %}
This paragraph explains that it will be followed by a list.

- This list has three items
- This is the second item
- The last item is the best
{% endcapture %}
{% include components/alert.html
  content=markdown_content
%}{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
  {% capture markdown_content %}
  This paragraph explains that it will be followed by a list.

  - This list has three items
  - This is the second item
  - The last item is the best

  This paragraph includes a [link](#)
  {% endcapture %}
  {% include components/alert.html
    content=markdown_content
  %}
</div>

#### Kitchen sink

#### Source

```liquid
{% raw %}{% include components/alert.html
  title="Pay attention"
  content="This is the body of the alert"
  level="danger"
%}{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
  {% include components/alert.html
    title="Pay attention"
    content="This is the body of the alert"
    level="danger"
  %}
</div>

[bs-alert]: https://getbootstrap.com/docs/4.0/components/alerts/
