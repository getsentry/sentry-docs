import React from "react";
import { Link } from "gatsby";

import ExternalLink from "./externalLink";

type Props = {
  to?: string;
  href?: string;
  remote?: boolean;
  children?: React.ReactNode;
  activeClassName?: string;
  className?: string;
  title?: string;
};

export default ({
  to,
  href,
  children,
  activeClassName = "active",
  remote = false,
  className = "",
  ...props
}: Props): JSX.Element => {
  const realTo = to || href || "";
  if (realTo.indexOf("://") !== -1) {
    return (
      <ExternalLink href={realTo} className={className} {...props}>
        {children}
      </ExternalLink>
    );
  } else if (realTo.indexOf("/") !== 0 || remote) {
    // this handles cases like anchor tags (where Link messes thats up)
    return (
      <a href={realTo} className={className} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link
      to={realTo}
      activeClassName={activeClassName}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};
