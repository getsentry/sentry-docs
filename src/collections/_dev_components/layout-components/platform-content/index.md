---
title: Platform Content
source: components/platform_content.html
example_string: Hello world

example_1:
  JavaScript: |
    ``` javascript
    console.log("{{ page.example_string }}")
    ```
  Python: |
    ``` python
    print("{{ page.example_string }}")
    ```
  Ruby: |
    ``` ruby
    puts "{{ page.example_string }}"
    ```

example_2:
  JavaScript: |
    ## I am an example about JavaScript

    Did you know 0 == false but 0 !== false?
  Python: |
    ```
    # This is a Python example. A python is a snake.
    ```
  Ruby: |
    - In Ruby
    - You have to
    - Say `end` a lot.

example_3:
  Python: Python Example
  Ruby: Ruby Example
---

You can customize content by platform. Within a folder in the same directory as your document, add a file for each platform you would like to include, ensuring that name of the file matches a slug in *src/data/platforms.yml*, then use the include to specify which folder to include examples from.

Content is run through the Liquid compiler, then through the Markdown compiler, making it possible to create dynamic, rich styled content.

The switcher will globally remember the prefered language and load it by default until changed. If no prefered language is set, the first langage provided is the default. A content platform content block does not contain the preferred language, it will display the default language for the block.

You may force the platform that is displayed on the page by appending a `platform=javascript` query parameter to the page url. This will cause subsequent pages in the browsing session to display that platform. Removing the query parameter will set the page back to the default behavior of looking for the prefered platform

- `content=[]` _(required)_ A unique key to identify the switcher

<hr>

### Basic use

#### File structure

```
_documentation/my-category/
  my-document.md
  my-example/
    javascript.md
    python.md
    ruby.md
```

#### Source

```liquid
{% raw %}{% include components/platform_content.html content_dir="my-example" %}{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% include components/platform_content.html content_dir="example_1" %}
</div>

### Mismatched platforms

This example does not have a Javascript, while the others on the page do. Try
using the other switchers to see how this one handles falling back when
JavaScript is selected.

#### File structure

```
_documentation/my-category/
  my-document.md
  my-example/
    python.md
    ruby.md
```

#### Source

```liquid
{% raw %}---
example_content:
  Python: Python Example
  Ruby: Ruby Example
---

{% include components/platform_content.html content_dir="my-example" %}{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% include components/platform_content.html content_dir="example_2" %}
</div>
