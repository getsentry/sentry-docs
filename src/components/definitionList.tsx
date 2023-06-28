import React from 'react';

export function DefinitionList({children}: {children: React.ReactNode}): JSX.Element {
  return <div className="large-definition-list">{children}</div>;
}
