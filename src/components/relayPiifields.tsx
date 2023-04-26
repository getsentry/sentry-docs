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
    const asterisk_flag = field.path.endsWith("other");

    return (
        <React.Fragment>
            <dt>
                <code>
                    {field.path}
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
