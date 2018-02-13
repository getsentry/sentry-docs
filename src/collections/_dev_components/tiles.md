---
---

- `label="This is a tile"` _(required)_ Title for the tile
- `icon="api"` _(required)_ Slug matching an icon filename in _includes/svg/

<hr>

#### Basic use

```liquid
{% raw %}{% include components/tile.html
  label="This is a tile"
  icon="api"
%}
{% endraw %}
```

<div class="mb-3 mb-md-5">
{%- include components/tile.html
  label="This is a tile"
  icon="api"
-%}
</div>
