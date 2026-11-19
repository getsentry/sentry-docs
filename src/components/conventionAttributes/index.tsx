import {
  ATTRIBUTE_METADATA,
  type AttributeMetadata,
  type AttributeValue,
} from '@sentry/conventions/attributes';
import {micromark} from 'micromark';

type Props = {
  attributes: (string | {key: string; example?: number; notes?: string})[];
};

const metadata: Record<string, AttributeMetadata> = ATTRIBUTE_METADATA;

/**
 * Renders attribute details from `@sentry/conventions`, so pages don't copy
 * types, descriptions, and examples that drift from the source of truth.
 */
export function ConventionAttributes({attributes}: Props) {
  const rows = attributes.map(row => {
    const {
      key,
      notes,
      example: exampleIndex,
    } = typeof row === 'string' ? {key: row} : row;
    // `Object.hasOwn` so keys like `constructor` don't pass as known attributes.
    const attribute = Object.hasOwn(metadata, key) ? metadata[key] : undefined;
    if (!attribute) {
      throw new Error(`<ConventionAttributes>: unknown attribute "${key}"`);
    }
    const description = micromark([attribute.brief, notes].filter(Boolean).join(' '))
      .replace(/^<p>/, '')
      .replace(/<\/p>$/, '');
    // Pick one of `examples` by index when the page asks for it, so a page can
    // show the example that fits its context.
    let example = attribute.example;
    if (exampleIndex !== undefined) {
      if (!attribute.examples || !Object.hasOwn(attribute.examples, exampleIndex)) {
        throw new Error(
          `<ConventionAttributes>: attribute "${key}" has no example at index ${exampleIndex}`
        );
      }
      example = attribute.examples[exampleIndex];
    }
    return {key, attribute, description, example};
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Type</th>
          <th>Description</th>
          <th>Example</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({key, attribute, description, example}) => (
          <tr key={key}>
            <td>
              <code>{key}</code>
            </td>
            <td>{attribute.type}</td>
            {/* Briefs are long; override the site's nowrap rule for non-last columns. */}
            <td
              style={{whiteSpace: 'normal', minWidth: '300px'}}
              dangerouslySetInnerHTML={{__html: description}}
            />
            <td>{example !== undefined && <code>{formatExample(example)}</code>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatExample(example: AttributeValue) {
  if (typeof example !== 'string') {
    return JSON.stringify(example);
  }
  // Single-quote stringified JSON so its inner double quotes stay readable.
  return /^[[{]/.test(example) ? `'${example}'` : `"${example}"`;
}
