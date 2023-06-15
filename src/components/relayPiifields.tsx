import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import styled from '@emotion/styled';

const query = graphql`
  query PiiFieldsQuery {
    allPiiFieldPath {
      nodes {
        path
        attributes {
          additional_properties
        }
      }
    }
  }
`;




const Asterisk = styled.span`
  margin-left: 5px;
`;

function PiiField({ field }) {
  const asterisk_flag = field.attributes.additional_properties !== null;


  return (
    <dt>
      <code>{field.path}</code>
      {asterisk_flag ? <Asterisk>*</Asterisk> : null}
    </dt>
  );
}



export function PiiFields(): JSX.Element {
  const data = useStaticQuery(query);
  const fields = data.allPiiFieldPath.nodes;

  return (
    <dl>
      {fields.map(field => (
        <PiiField key={field.path} field={field} />
      ))}
    </dl>
  );
}
