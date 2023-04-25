import fields from '../../data/relay_event_pii.json';

export const piiFieldsNodes = ({ actions, createNodeId, createContentDigest }) => {
    const { createNode } = actions;

    fields.forEach(field => {

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
