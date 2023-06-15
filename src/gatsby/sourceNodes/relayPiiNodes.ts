import fs from 'fs';
import path from 'path';




export const piiFieldsNodes = ({ actions, createNodeId, createContentDigest }) => {
    const { createNode } = actions;

    const data = fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'relay_event_pii.json'), 'utf-8');
    const fields = JSON.parse(data);

    fields.forEach((field, index) => {
        const fieldNode = {
            // extract path and attributes from field object
            path: field.path,
            attributes: field.attributes,
            id: createNodeId(`PiiFieldPath-${index}`),
            internal: {
                type: 'PiiFieldPath',
                // use JSON.stringify to convert field object into a string for contentDigest
                contentDigest: createContentDigest(JSON.stringify(field)),
            },
        };

        createNode(fieldNode);
    });
};
