---
title: Platform Content
example_string: Hello World
arguments:
  - name: 'content_dir="my-example"'
    type: String
    required: true
    desc: Name of the folder where the examples are stored, relative to the current document
examples:
  - title: Basic use
    desc: |
      #### File Structure

      ```
      _documentation/this-category/
        this-document.md
        example-1/
          javascript.md
          python.md
          ruby.md
      ```
    source: |
      {% include components/platform_content.html content_dir="example_1" %}
---

You can customize content by platform. Within a folder in the same directory as your document, add a file for each platform you would like to include, ensuring that name of the file matches a slug in *src/data/platforms.yml*, then use the include to specify which folder to include examples from.

Content is run through the Liquid compiler, then through the Markdown compiler, making it possible to create dynamic, rich styled content.

The switcher will globally remember the prefered language and load it by default until changed. If no prefered language is set, the first langage provided is the default. A content platform content block does not contain the preferred language, it will display the default language for the block.

You may force the platform that is displayed on the page by appending a `platform=javascript` query parameter to the page url. This will cause subsequent pages in the browsing session to display that platform. Removing the query parameter will set the page back to the default behavior of looking for the prefered platform
