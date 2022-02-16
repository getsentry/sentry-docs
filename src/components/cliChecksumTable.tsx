import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import styled from "@emotion/styled";

const query = graphql`
  query CliExecutableChecksums {
    app(id: { eq: "sentry-cli" }) {
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
  font-size: 0.8em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default (): JSX.Element => {
  const {
    app: { files },
  } = useStaticQuery(query);

  return (
    <table style={{ display: "block", overflow: "scroll" }}>
      <thead>
        <tr>
          <th>File</th>
          <th>Integrity Checksum</th>
        </tr>
      </thead>
      <tbody>
        {files
          .filter(file => !file.name.endsWith(".tgz"))
          .map(file => (
            <tr key={file.name}>
              <td
                style={{
                  fontSize: "0.9em",
                  verticalAlign: "middle",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </td>
              <td style={{ verticalAlign: "middle" }}>
                <ChecksumValue>
                  {`sha384-${
                    file.checksums.find(c => c.name === "sha256-hex").value
                  }`}
                </ChecksumValue>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
