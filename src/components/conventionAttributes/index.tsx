import {
  ATTRIBUTE_METADATA,
  type AttributeMetadata,
  type AttributeValue,
} from '@sentry/conventions/attributes';
import {micromark} from 'micromark';
import {Fragment} from 'react';

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
    const attribute = metadata[key];
    if (!attribute) {
      throw new Error(`<ConventionAttributes>: unknown attribute "${key}"`);
    }
    const description = micromark([attribute.brief, notes].filter(Boolean).join(' '))
      .replace(/^<p>/, '')
      .replace(/<\/p>$/, '');
    return {key, attribute, description};
  });
  const firstKey = rows[0].key;
  const category = firstKey.includes('.') ? firstKey.split('.')[0] : 'general';

  return (
    <Fragment>
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
              <td dangerouslySetInnerHTML={{__html: description}} />
              <td>
                {attribute.example !== undefined && (
                  <code>{formatExample(attribute.example)}</code>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        See all{' '}
        <a
          href={`https://getsentry.github.io/sentry-conventions/attributes/${category}/`}
        >
          <code>{category}</code> attributes in Sentry Conventions
        </a>
        .
      </p>
    </Fragment>
  );
}

function formatExample(example: AttributeValue) {
  return typeof example === 'string' ? `"${example}"` : JSON.stringify(example);
}
