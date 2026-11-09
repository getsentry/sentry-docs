import {
  ATTRIBUTE_METADATA,
  type AttributeMetadata,
  type AttributeValue,
} from '@sentry/conventions/attributes';
import {micromark} from 'micromark';

type Props = {
  attributes: (string | {key: string; notes?: string})[];
};

const metadata: Record<string, AttributeMetadata> = ATTRIBUTE_METADATA;

/**
 * Renders attribute details from `@sentry/conventions`, so pages don't copy
 * types, descriptions, and examples that drift from the source of truth.
 */
export function ConventionAttributes({attributes}: Props) {
  const rows = attributes.map(row => {
    const {key, notes} = typeof row === 'string' ? {key: row} : row;
    // `Object.hasOwn` so keys like `constructor` don't pass as known attributes.
    const attribute = Object.hasOwn(metadata, key) ? metadata[key] : undefined;
    if (!attribute) {
      throw new Error(`<ConventionAttributes>: unknown attribute "${key}"`);
    }
    const description = micromark([attribute.brief, notes].filter(Boolean).join(' '))
      .replace(/^<p>/, '')
      .replace(/<\/p>$/, '');
    return {key, attribute, description};
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
        {rows.map(({key, attribute, description}) => (
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
            <td>
              {attribute.example !== undefined && (
                <code>{formatExample(attribute.example)}</code>
              )}
            </td>
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
