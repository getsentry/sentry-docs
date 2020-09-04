import React from "react";

export default ({ children }: React.Props<{}>): JSX.Element => {
  return <div className="large-definition-list">{children}</div>;
};
