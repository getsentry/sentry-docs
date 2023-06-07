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
    const asterisk_flag = field.endsWith("other");

    return (
        <React.Fragment>
            <dt>
                <code>
                    {field}
                </code>
                {
                    asterisk_flag ?
                        <span style={{ marginLeft: '5px' }}>

                            *
                        </span> :
                        null
                }
            </dt>
        </React.Fragment>
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
