import fields from '../../data/relay_event_pii.json';

export const piiFieldsNodes = ({actions, createNodeId, createContentDigest}) => {
  const {createNode} = actions;

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
