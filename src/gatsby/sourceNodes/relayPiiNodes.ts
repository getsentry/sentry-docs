/* eslint import/no-nodejs-modules:0 */

import fs from 'fs';
import path from 'path';

import {SourceNodesArgs} from 'gatsby';

interface PiiField {
  additional_properties: string;
  path: string;
}

export const piiFieldsNodes = ({
  actions,
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => {
  const {createNode} = actions;

  const data = fs.readFileSync(
    path.join(__dirname, '..', '..', 'data', 'relay_event_pii.json'),
    'utf-8'
  );
  const fields: PiiField[] = JSON.parse(data);

  fields.forEach((field, index) => {
    const fieldNode = {
      path: field.path,
      additional_properties: field.additional_properties,
      id: createNodeId(`PiiFieldPath-${index}`),
      internal: {
        type: 'PiiFieldPath',
        contentDigest: createContentDigest(JSON.stringify(field)),
      },
    };

    createNode(fieldNode);
  });
};
