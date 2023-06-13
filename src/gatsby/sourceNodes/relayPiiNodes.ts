import fs from 'fs';
import path from 'path';

export const piiFieldsNodes = ({ actions, createNodeId, createContentDigest }) => {
    const { createNode } = actions;

    const data = fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'relay_event_pii.txt'), 'utf-8');
    const fields = data.split('\n').map(line => line.trim()).filter(Boolean);

    fields.forEach((field, index) => {
        const fieldNode = {
            path: field,
            id: createNodeId(`PiiFieldPath-${index}`),
            internal: {
                type: 'PiiFieldPath',
                contentDigest: createContentDigest(field),
            },
        };

        createNode(fieldNode);
    });
};
