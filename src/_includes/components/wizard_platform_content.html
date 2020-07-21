{%- assign __uniq = include.content | jsonify | md5 -%}
{%- assign __file_name = page.path
  | file_name
-%}
{%- assign __dir = page.relative_path
  | remove: __file_name
  | append: include.content_dir
  | append: '/'
-%}
{%- assign __includes = site.documents
  | map: 'path'
  | where_exp: "item", 'item contains __dir'
-%}

{%- for __include in __includes -%}
  {%- assign __slug = __include | file_slug -%}
  {%- if __slug == wizard_slug -%}
    {%- assign __name = __include | file_name -%}
    {%- assign __relative_path = include.content_dir
      | append: "/"
      | append: __name
    -%}
    {%- capture __content -%}
      {% include_relative {{ __relative_path }} %}
    {%- endcapture -%}
    {{ __content | strip_front_matter }}
  {%- endif -%}
{%- endfor -%}
