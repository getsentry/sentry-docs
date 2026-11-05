import {
  ATTRIBUTE_METADATA,
  type AttributeMetadata,
  type AttributeValue,
} from '@sentry/conventions/attributes';
import {micromark} from 'micromark';

const CONVENTIONS_URL = 'https://getsentry.github.io/sentry-conventions/';

type AttributeRow =
  | string
  | {
      key: string;
      /** Markdown appended to the conventions description, such as footnote references. */
      notes?: string;
    };

type Props = {
  attributes: AttributeRow[];
};

const metadata: Record<string, AttributeMetadata> = ATTRIBUTE_METADATA;

/**
 * Renders attribute details straight from `@sentry/conventions`, so pages don't copy
 * types, descriptions, and examples that then drift from the source of truth.
 *
 * Page-specific context, such as footnotes, stays in the MDX and is passed per row.
 */
export function ConventionAttributes({attributes}: Props) {
  const rows = attributes.map(row => {
    const {key, notes} = typeof row === 'string' ? {key: row} : row;
    const attribute = metadata[key];
    if (!attribute) {
      // Fail the build so typos and removed attributes don't ship as empty rows.
      throw new Error(
        `<ConventionAttributes>: unknown attribute "${key}". Check ${CONVENTIONS_URL}attributes/`
      );
    }
    return {key, notes, attribute};
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
        {rows.map(({key, notes, attribute}) => (
          <tr key={key}>
            <td>
              <a href={conventionsUrl(key)}>
                <code>{key}</code>
              </a>
            </td>
            <td>{attribute.type}</td>
            <td>
              <InlineMarkdown source={describe(attribute, notes)} />
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
  );
}

function describe(attribute: AttributeMetadata, notes?: string) {
  const {deprecation} = attribute;
  const deprecated = deprecation
    ? `**Deprecated**${deprecation.replacement ? `, use \`${deprecation.replacement}\` instead` : ''}.`
    : undefined;
  return [deprecated, attribute.brief, notes].filter(Boolean).join(' ');
}

function InlineMarkdown({source}: {source: string}) {
  // Unwrap the single paragraph so table rows keep a compact, aligned layout.
  const html = micromark(source)
    .replace(/^<p>/, '')
    .replace(/<\/p>$/, '');
  // Content comes from the pinned conventions package and our own MDX, not user input.
  return <span dangerouslySetInnerHTML={{__html: html}} />;
}

// Mirrors attributeUrl() in sentry-conventions/docs/src/utils/attributeUrl.ts.
export function conventionsUrl(key: string) {
  const category = key.includes('.') ? key.split('.')[0] : 'general';
  const slug = key.replace(/\./g, '-').replace(/[<>]/g, '');
  return `${CONVENTIONS_URL}attributes/${category}/#${slug}`;
}

function formatExample(example: AttributeValue) {
  return typeof example === 'string' ? `"${example}"` : JSON.stringify(example);
}
