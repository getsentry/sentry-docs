'use client';

import styled from '@emotion/styled';

const ChecksumValue = styled.code`
  font-size: 0.75em;
  white-space: nowrap;
`;

export type Files = {
  checksums: {
    name: string;
    value: string;
  }[];
  name: string;
};

type Props = {
  files: Files[];
  version: string;
};

export function CliChecksumTableClient({version, files}: Props) {
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
                  {`sha384-${file.checksums.find(c => c.name === 'sha256-hex')?.value}`}
                </ChecksumValue>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
