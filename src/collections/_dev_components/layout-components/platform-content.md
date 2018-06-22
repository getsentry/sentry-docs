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
---

{% include platform_content.html content=page.example_content %}{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% include components/platform_content.html content=page.example_1 %}
</div>

### Arbitrary content

#### Source

```liquid
{% raw %}---
example_content:
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
---

{% include platform_content.html content=page.example_content %}{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% include components/platform_content.html content=page.example_2 %}
</div>
