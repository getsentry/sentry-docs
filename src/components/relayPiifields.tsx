import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

const query = graphql`
  query PiiFieldsQuery {
    allPiiFieldPath
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

export default function PiiFields(): JSX.Element {
    const data = useStaticQuery(query);
    const fields = data.allPiiFieldPath;

    return (
        <dl>
            {fields.map(field => (
                <PiiField key={field} field={field} />
            ))}
        </dl>
    );
}
