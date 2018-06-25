---
title: Interactive Content
example_string: Hello world
example_1:
  JavaScript: |
    This is a JavaScript example.

    ``` javascript
    console.log("Your DSN is ___PUBLIC_DSN___")
    ```
  Python: |
    This is a Python example.

    ``` python
    print("Your DSN is ___PUBLIC_DSN___")
    ```
  Ruby: |
    This is a Ruby example.

    ``` ruby
    puts "Your DSN is ___PUBLIC_DSN___"
    ```
---

It is possible to display a user's actual configuration information within code samples. This is done using one of the following keys:

<div data-dynamic-token-list></div>

This feature only works within block level code examples, which are created using tripple tick <code>```</code> fenced code blocks in Markdown or using Jekyll's `highlight` tag.

### Basic use

#### Source

{% include components/alert.html content="Do not copy and paste from this example. It contains invisible characters that prevent the tokens from rendering." %}

```liquid
{% raw %}`⁣``javascript
console.log("Your DSN is _⁣__DSN___")
console.log("Your ENCODED_API_KEY is _⁣__ENCODED_API_KEY___")
`⁣``{% endraw %}
```

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% highlight javascript %}
console.log("Your DSN is ___DSN___")
console.log("Your ENCODED_API_KEY is ___ENCODED_API_KEY___")
{% endhighlight %}
</div>

### Use in platform content

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% include components/platform_content.html content=page.example_1 %}
</div>
