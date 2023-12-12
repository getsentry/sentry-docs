import React from 'react';
import styled from '@emotion/styled';
import {graphql, useStaticQuery} from 'gatsby';

const query = graphql`
  query PiiFieldsQuery {
    allPiiFieldPath {
      nodes {
        path
        additional_properties
      }
    }
  }
`;

const Asterisk = styled.span`
  margin-left: 5px;
`;

function PiiField({field}) {
  const asterisk_flag = field.additional_properties;

  return (
    <dt>
      <code>{field.path}</code>
      {asterisk_flag ? (
        <code>
          <em>.other</em>
        </code>
      ) : null}
      {asterisk_flag ? <Asterisk>*</Asterisk> : null}
    </dt>
  );
}

export function PiiFields() {
  const data = useStaticQuery(query);
  const fields = data.allPiiFieldPath.nodes;

  // Check if any field has additional_properties set to true
  const hasStar = fields.some(field => field.additional_properties);

  return (
    <dl>
      {fields.map(field => (
        <PiiField key={field.path} field={field} />
      ))}
      {hasStar && (
        <dd>
          * Not an actual field, but represents unstructured data that is not part of the
          schema.
        </dd>
      )}
    </dl>
  );
}
