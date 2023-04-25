import fields from '../../data/relay_pii.json';

export const piiFieldsNodes = ({ actions, createNodeId, createContentDigest }) => {
    const { createNode } = actions;

    fields.forEach(field => {
        console.log('Field:', field); // Add this line to print the field

        const fieldNode = {
            ...field,
            id: createNodeId(field.path),
            internal: {
                type: 'PiiFieldPath',
                contentDigest: createContentDigest(field),
            },
        };

        createNode(fieldNode);
    });
};
