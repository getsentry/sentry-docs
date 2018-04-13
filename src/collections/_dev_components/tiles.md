---
title: Tiles
source: components/tile.html
---

- `label="This is a tile"` _(required)_ Title for the tile
- `icon="api"` _(required)_ Slug matching an icon filename in _includes/svg/

<hr>

### Basic use

#### Source

```liquid
{% raw %}{% include components/tile.html
  label="This is a tile"
  icon="api"
%}{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{%- include components/tile.html
  label="This is a tile"
  icon="api"
-%}
</div>
