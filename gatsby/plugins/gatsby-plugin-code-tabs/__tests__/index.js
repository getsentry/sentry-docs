const Remark = require("remark");
const toString = require("mdast-util-to-string");
const visit = require("unist-util-visit");

const plugin = require("../");

const remark = new Remark().data("settings", {
  commonmark: true,
  footnotes: true,
  pedantic: true,
});

describe("gatsby-plugin-code-tabs", () => {
  it("folds two code blocks", () => {
    const markdownAST = remark.parse(`
~~~python
print "Hello World!"
~~~

~~~javascript
console.log("Hello World!");
~~~
`);
    const transformed = plugin({ markdownAST }, {});
    expect(transformed).toMatchSnapshot();
  });

  it("does not fold code blocks split by a paragraph", () => {
    const markdownAST = remark.parse(`
~~~python
print "Hello World!"
~~~

some text here:

~~~javascript
console.log("Hello World!");
~~~
`);
    const transformed = plugin({ markdownAST }, {});
    expect(transformed).toMatchSnapshot();
  });

  it("does not fold code blocks on different levels", () => {
    const markdownAST = remark.parse(`
1. a list here
   ~~~plain
   inside list
   ~~~

~~~plain
outside list
~~~
`);
    const transformed = plugin({ markdownAST }, {});
    expect(transformed).toMatchSnapshot();
  });

  it("supports tab titles", () => {
    const markdownAST = remark.parse(`
~~~plain {tabTitle: Hello}
first
~~~

~~~plain {tabTitle: Goodbye}
second
~~~
`);
    const transformed = plugin({ markdownAST }, {});
    expect(transformed).toMatchSnapshot();
  });

  it("supports filenames", () => {
    const markdownAST = remark.parse(`
~~~plain {tabTitle: Hello} {filename: hello.txt}
first
~~~

~~~plain {tabTitle: Goodbye} {filename: goodbye.txt}
second
~~~
`);
    const transformed = plugin({ markdownAST }, {});
    expect(transformed).toMatchSnapshot();
  });
});
