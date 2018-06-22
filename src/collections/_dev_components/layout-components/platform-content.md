---
title: Platform Content
source: components/platform_content.html
example_string: Hello world
example_1:
  JavaScript: |
    This is a JavaScript example.

    ``` javascript
    console.log("{{ page.example_string }}")
    ```
  Python: |
    This is a Python example.

    ``` python
    print("{{ page.example_string }}")
    ```
  Ruby: |
    This is a Ruby example.

    ``` ruby
    puts "{{ page.example_string }}"
    ```
---

You can customize content by platform. The switcher will globally remember the prefer language and load it by default until changed. Content is run through the Liquid compiler, then through the Markdown compiler, making it possible to create dynamic, rich styled content.

- `content=[]` _(required)_ A unique key to identify the switcher

<hr>

### Basic use

#### Source

```liquid
{% raw %}---
example_string: Hello world
example_content:
  JavaScript: |
    This is a JavaScript example.

    ``` javascript
    console.log("{{ page.example_string }}")
    ```
  Python: |
    This is a Python example.

    ``` python
    print("{{ page.example_string }}")
    ```
  Ruby: |
    This is a Ruby example.

    ``` ruby
    puts "{{ page.example_string }}"
    ```
---

{% include platform_content.html content=page.example_content %}{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% include components/platform_content.html content=page.example_1 %}
</div>
