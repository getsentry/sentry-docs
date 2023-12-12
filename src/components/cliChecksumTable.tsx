import React from 'react';
import styled from '@emotion/styled';
import {graphql, useStaticQuery} from 'gatsby';

const query = graphql`
  query CliExecutableChecksums {
    app(id: {eq: "sentry-cli"}) {
      version
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

export function CliChecksumTable() {
  const {
    app: {files, version},
  } = useStaticQuery(query);

  return (
    <table style={{display: 'block', overflow: 'scroll'}}>
      <thead>
        <tr>
          <th>Filename (v{version})</th>
          <th>Integrity Checksum</th>
        </tr>
      </thead>
      <tbody>
        {files
          .filter(file => !file.name.endsWith('.tgz'))
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
                  {`sha384-${file.checksums.find(c => c.name === 'sha256-hex').value}`}
                </ChecksumValue>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
