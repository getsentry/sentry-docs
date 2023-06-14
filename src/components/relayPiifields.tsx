import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import styled from '@emotion/styled';


const query = graphql`
  query PiiFieldsQuery {
    allPiiFieldPath {
      nodes {
        path
      }
    }
  }
`;

const Asterisk = styled.span`
  margin-left: 5px;
`;

function PiiField({ field }) {
  const asterisk_flag = field.endsWith('other');

  return (
    <dt>
      <code>{field}</code>
      {asterisk_flag ? <Asterisk>*</Asterisk> : null}
    </dt>
  );
}

export function PiiFields(): JSX.Element {
  const data = useStaticQuery(query);
  const fields = data.allPiiFieldPath.nodes.map(node => node.path);

  return (
    <dl>
      {fields.map(field => (
        <PiiField key={field} field={field} />
      ))}
    </dl>
  );
}
