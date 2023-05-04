import React from 'react';
import styled from '@emotion/styled';
import {graphql, useStaticQuery} from 'gatsby';

const query = graphql`
  query JsBundleList {
    package(id: {eq: "sentry.javascript.browser"}) {
      files {
        name
        checksums {
          name
          value
        }
      }
    }
  }
`;

const ChecksumValue = styled.code`
  font-size: 0.75em;
  white-space: nowrap;
`;

export default function JsBundleList(): JSX.Element {
  const {
    package: {files},
  } = useStaticQuery(query);

  return (
    <table style={{display: 'block', overflow: 'scroll'}}>
      <thead>
        <tr>
          <th>File</th>
          <th>Integrity Checksum</th>
        </tr>
      </thead>
      <tbody>
        {files
          .filter(file => file.name.endsWith('.js'))
          .map(file => (
            <tr key={file.name}>
              <td
                style={{
                  fontSize: '0.9em',
                  verticalAlign: 'middle',
                  whiteSpace: 'nowrap',
                }}
              >
                {file.name}
              </td>
              <td style={{verticalAlign: 'middle', width: '100%'}}>
                <ChecksumValue>
                  {`sha384-${file.checksums.find(c => c.name === 'sha384-base64').value}`}
                </ChecksumValue>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
