import React from 'react';

export default function DefinitionList({children}: React.Props<{}>): JSX.Element {
  return <div className="large-definition-list">{children}</div>;
}
