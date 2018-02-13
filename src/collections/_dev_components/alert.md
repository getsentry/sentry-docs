---
---

- `title="note"` _(optional)_ Title for the alert
- `content=""` _(required)_ Content for the alert
- `level="warn"` _(optional)_ Severity of the alert. Must be a valid [Bootstrap severity level][bs-alert].

<hr>

#### Basic use

```liquid
{% raw %}{% include components/alert.html
  content="This is the body of the alert"
%}{% endraw %}
```

<div class="mb-3 mb-md-5">
  {% include components/alert.html
    content="This is the body of the alert"
  %}
</div>

#### Full markdown content

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
<div class="mb-3 mb-md-5">
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

```liquid
{% raw %}{% include components/alert.html
  title="Pay attention"
  content="This is the body of the alert"
  level="danger"
%}{% endraw %}
```

<div class="mb-3 mb-md-5">
  {% include components/alert.html
    title="Pay attention"
    content="This is the body of the alert"
    level="primary"
  %}
</div>

[bs-alert]: https://getbootstrap.com/docs/4.0/components/alerts/
