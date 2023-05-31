import React from 'react';

export function DefinitionList({children}: React.Props<{}>): JSX.Element {
  return <div className="large-definition-list">{children}</div>;
}
