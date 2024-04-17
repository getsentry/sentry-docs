import fields from 'sentry-docs/data/relay_event_pii.json';
import styles from './style.module.scss';

function PiiField({field}) {
  const asterisk_flag = field.additional_properties;

  return (
    <li style={{marginTop: '0.5rem'}}>
      <code className={styles.code}>{field.path}</code>
      {asterisk_flag ? (
        <code className={styles.code}>
          <em>.other</em>
        </code>
      ) : null}
      {asterisk_flag ? <span className={styles.asterisk}>*</span> : null}
    </li>
  );
}

export function PiiFields() {
  // Check if any field has additional_properties set to true
  const hasStar = fields.some(field => field.additional_properties);

  return (
    <ul>
      {fields.map(field => (
        <PiiField key={field.path} field={field} />
      ))}
      {hasStar && (
        <dd>
          * Not an actual field, but represents unstructured data that is not part of the
          schema.
        </dd>
      )}
    </ul>
  );
}
