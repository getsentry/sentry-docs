# SplitLayout Component

A layout component for getting started guides that pairs explanatory text with a code sample. Sections render in a single column: the text comes first, followed by its code sample.

## Features

- **Single Column**: Text and code stack vertically at every viewport width
- **Clean Separation**: Clear visual separation between explanation and implementation
- **Flexible Content**: Support for any MDX content in both sections

## Usage

### Basic Example

**Note:** MDX requires direct component names, not dot notation.

````mdx
<SplitLayout>
  <SplitSection>
    <SplitSectionText>
      ### Your Heading Explanatory text goes here. You can use any markdown: -
      Lists - **Bold text** - Links This content appears first.
    </SplitSectionText>

    <SplitSectionCode>
      ```javascript // Your code sample goes here const example = "This appears
      below the text"; ```
    </SplitSectionCode>

  </SplitSection>
</SplitLayout>
````

### Multiple Sections

You can stack multiple split sections within one layout:

````mdx
<SplitLayout>
  <SplitSection>
    <SplitSectionText>
      ### First Topic
      Explanation for the first topic...
    </SplitSectionText>
    <SplitSectionCode>
      ```javascript
      const first = "code";
      ```
    </SplitSectionCode>
  </SplitSection>

  <SplitSection>
    <SplitSectionText>
      ### Second Topic
      Explanation for the second topic...
    </SplitSectionText>
    <SplitSectionCode>
      ```javascript
      const second = "code";
      ```
    </SplitSectionCode>
  </SplitSection>
</SplitLayout>
````

## Component Structure

- **`<SplitLayout>`**: Container for one or more split sections
- **`<SplitSection>`**: Individual split section wrapper
- **`<SplitSectionText>`**: Text content, rendered first (use this, not `<SplitSection.Text>`)
- **`<SplitSectionCode>`**: Code samples, rendered below the text (use this, not `<SplitSection.Code>`)

## Styling

The component uses a single-column CSS Grid at every viewport width. Each section's text is followed by its code sample.

## Best Practices

1. **Keep explanations concise**: Text sits directly above its code, so focus on key points
2. **Use headings**: Start each Text section with a heading (h3 or h4)
3. **Code relevance**: Ensure code samples directly relate to the adjacent text
4. **Progressive complexity**: Order sections from simple to complex
5. **Reading flow**: Content always stacks, so make sure each text section leads naturally into its code

## Examples in Use

See it in action:

- [Next.js Manual Setup](/platforms/javascript/guides/nextjs/manual-setup/)
