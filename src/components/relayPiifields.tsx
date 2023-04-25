import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

const query = graphql`
  query PiiFieldsQuery {
    allPiiFieldPath {
      nodes {
        path
      }
    }
  }
`;

function PiiField({ field }) {
    return (
        <React.Fragment>
            <dt>
                <code>
                    {field.path}
                </code>
            </dt>
        </React.Fragment>
    );
}

export default function PiiFields(): JSX.Element {
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
