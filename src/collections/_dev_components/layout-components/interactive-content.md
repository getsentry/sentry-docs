---
title: Interactive Content
example_string: Hello world
example_1:
  JavaScript: |
    This is a JavaScript example.

    {%- highlight javascript -%}
    console.log("Your DSN is ___PUBLIC_DSN___")
    {%- endhighlight -%}
  Python: |
    This is a Python example.

    {%- highlight python -%}
    print("Your DSN is ___PUBLIC_DSN___")
    {%- endhighlight -%}
  Ruby: |
    This is a Ruby example.

    {%- highlight ruby -%}
    puts "Your DSN is ___PUBLIC_DSN___"
    {%- endhighlight -%}
---

When a user is logged in, content may be customized for them.

### Basic use

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% highlight javascript %}
console.log("Your DSN is ___DSN___")
console.log("Your PUBLIC_DSN is ___PUBLIC_DSN___")
console.log("Your PUBLIC_KEY is ___PUBLIC_KEY___")
console.log("Your SECRET_KEY is ___SECRET_KEY___")
console.log("Your API_URL is ___API_URL___")
console.log("Your ENCODED_API_KEY is ___ENCODED_API_KEY___")
console.log("Your PROJECT_ID is ___PROJECT_ID___")
console.log("Your ORG_NAME is ___ORG_NAME___")
console.log("Your PROJECT_NAME is ___PROJECT_NAME___")
{% endhighlight %}
</div>

### Use in platform content

#### Output

<div class="p-3 mb-3 mb-md-5 border rounded content-flush-bottom">
{% include components/platform_content.html content=page.example_1 %}
</div>
