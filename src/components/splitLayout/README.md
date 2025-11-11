# SplitLayout Component

A two-column layout component designed for getting started guides that places explanatory text on the left and code samples on the right.

## Features

- **Responsive Design**: Automatically stacks on mobile (under 1024px)
- **Sticky Code**: Code samples stick to viewport on desktop for easy reference while scrolling
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
      Lists - **Bold text** - Links This content appears on the left side.
    </SplitSectionText>

    <SplitSectionCode>
      ```javascript // Your code sample goes here const example = "This appears
      on the right"; ```
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
- **`<SplitSectionText>`**: Left side text content (use this, not `<SplitSection.Text>`)
- **`<SplitSectionCode>`**: Right side code samples (use this, not `<SplitSection.Code>`)

## Styling

The component uses CSS Grid for layout and is fully responsive:

- **Desktop (>1024px)**: Two columns (50/50 split)
- **Mobile (≤1024px)**: Single column (stacked)

The code section uses `position: sticky` on desktop to keep code visible while scrolling through long explanations.

## Best Practices

1. **Keep explanations concise**: The left column is limited in width, so focus on key points
2. **Use headings**: Start each Text section with a heading (h3 or h4)
3. **Code relevance**: Ensure code samples directly relate to the adjacent text
4. **Progressive complexity**: Order sections from simple to complex
5. **Mobile consideration**: Remember content stacks on mobile, so ensure reading flow makes sense

## Examples in Use

See it in action:

- [Next.js Getting Started - Essential Configuration](/platforms/javascript/guides/nextjs/getting-started/#essential-configuration)
