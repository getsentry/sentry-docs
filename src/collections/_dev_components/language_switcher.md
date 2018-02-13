---
title: Language Switcher
---

It is possible to define platform-specific examples of content using `_includes/language_switcher.html`. This is done by capturing content as variables, then passing it to the include. The include first runs the content through the Liquid compiler, then through the Markdown compiler, making it possible to create dynamic, rich styled content.

- `key="note"` _(required)_ A unique key to identify the switcher
- `platforms=[]` _(required)_ An array of language names
- `contents=[]` _(optional)_ An array of content strings

<hr>

```liquid
{% raw %}# Define the content for each platform
{% capture javascript_content %}
  {%- highlight javascript -%}
  console.log("Hello world")
  {%- endhighlight -%}
{% endcapture %}
{% capture python_content %}
  {%- highlight python -%}
  print("Hello world")
  {%- endhighlight -%}
{% endcapture %}
{% capture ruby_content %}
  {%- highlight ruby -%}
  puts "Hello world"
  {%- endhighlight -%}
{% endcapture %}
# Define an Array of platforms to display
{% assign platforms = site.Array
  | push: site.data.platforms.javascript
  | push: site.data.platforms.python
  | push: site.data.platforms.ruby
%}

# Define an Array of platform specific contents
{% assign contents = site.Array
  | push: javascript_content
  | push: python_content
  | push: ruby_content
%}

# Feed the examples to the component
{% include platform_specific_content.html
  key="language-switcher-example"
  platforms=platforms
  contents=contents
%}{% endraw %}
```

<div class="p-3 mb-3 mb-md-5 border rounded">
{% capture javascript_content %}
  {%- highlight javascript -%}
  console.log("Hello world")
  {%- endhighlight -%}
{% endcapture %}
{% capture python_content %}
  {%- highlight python -%}
  print("Hello world")
  {%- endhighlight -%}
{% endcapture %}
{% capture ruby_content %}
  {%- highlight ruby -%}
  puts "Hello world"
  {%- endhighlight -%}
{% endcapture %}
{% assign platforms = site.Array
  | push: site.data.platforms.javascript
  | push: site.data.platforms.python
  | push: site.data.platforms.ruby
%}
{% assign contents = site.Array
  | push: javascript_content
  | push: python_content
  | push: ruby_content
%}
{% include platform_specific_content.html
  key="language-switcher-example"
  platforms=platforms
  contents=contents
%}
</div>
