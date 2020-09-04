import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import styled from "@emotion/styled";

const query = graphql`
  query JsBundleList {
    package(id: { eq: "sentry.javascript.browser" }) {
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
    package: { files },
  } = useStaticQuery(query);

  return (
    <table>
      <thead>
        <tr>
          <th>File</th>
          <th>Integrity Checksum</th>
        </tr>
      </thead>
      <tbody>
        {files.map(file => {
          return (
            <tr key={file.name}>
              <td style={{ fontSize: "0.9em", verticalAlign: "middle" }}>
                {file.name}
              </td>
              <td style={{ verticalAlign: "middle" }}>
                <ChecksumValue>
                  {`sha384-${
                    file.checksums.find(c => c.name === "sha384-base64").value
                  }`}
                </ChecksumValue>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
