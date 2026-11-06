import {
  ATTRIBUTE_METADATA,
  type AttributeMetadata,
  type AttributeValue,
} from '@sentry/conventions/attributes';
import {micromark} from 'micromark';
import {Fragment} from 'react';

type Props = {
  attributes: string[];
};

const metadata: Record<string, AttributeMetadata> = ATTRIBUTE_METADATA;

/**
 * Renders attribute details from `@sentry/conventions`, so pages don't copy
 * types, descriptions, examples, and notes that drift from the source of truth.
 * Each attribute's `additionalContext` becomes a numbered note under the table.
 * Attributes that share a note point to the same number.
 */
export function ConventionAttributes({attributes}: Props) {
  const notes: string[] = [];
  const rows = attributes.map(key => {
    const attribute = metadata[key];
    if (!attribute) {
      throw new Error(`<ConventionAttributes>: unknown attribute "${key}"`);
    }
    const noteNumbers = (attribute.additionalContext ?? []).map(note => {
      const index = notes.indexOf(note);
      return index === -1 ? notes.push(note) : index + 1;
    });
    return {key, attribute, noteNumbers};
  });
  const firstKey = rows[0].key;
  const category = firstKey.includes('.') ? firstKey.split('.')[0] : 'general';
  const noteId = (n: number) => `${firstKey.replace(/\./g, '-')}-note-${n}`;

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
          {rows.map(({key, attribute, noteNumbers}) => (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>{attribute.type}</td>
              <td>
                <span
                  dangerouslySetInnerHTML={{__html: inlineMarkdown(attribute.brief)}}
                />
                {noteNumbers.map(n => (
                  <sup key={n}>
                    <a href={`#${noteId(n)}`}>[{n}]</a>
                  </sup>
                ))}
              </td>
              <td>
                {attribute.example !== undefined && (
                  <code>{formatExample(attribute.example)}</code>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {notes.length > 0 && (
        <ol>
          {notes.map((note, i) => (
            <li
              key={note}
              id={noteId(i + 1)}
              dangerouslySetInnerHTML={{__html: inlineMarkdown(note)}}
            />
          ))}
        </ol>
      )}
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

function inlineMarkdown(text: string) {
  return micromark(text)
    .replace(/^<p>/, '')
    .replace(/<\/p>$/, '');
}

function formatExample(example: AttributeValue) {
  return typeof example === 'string' ? `"${example}"` : JSON.stringify(example);
}
