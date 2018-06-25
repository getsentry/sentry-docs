---
title: User Content
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

<div data-user-token-list></div>

This feature only works within block level code examples, which are created using tripple tick <code>```</code> fenced code blocks in Markdown or using Jekyll's `highlight` tag.

### Basic use

#### Source

```liquid
{% raw %}`⁣``javascript
console.log("Your DSN is _⁣__DSN___")
`⁣``{% endraw %}
```

{% include components/alert.html content="Do not copy and paste from this example. It contains invisible characters that prevent the tokens from rendering." %}

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% highlight javascript %}
console.log("Your DSN is ___DSN___")
{% endhighlight %}
</div>
