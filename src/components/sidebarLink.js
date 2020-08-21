import { withPrefix } from "gatsby";
import React from "react";
import { useLocation } from "@reach/router";

import SmartLink from "./smartLink";

export default ({ to, title, children, ...props }) => {
  const location = useLocation();
  const isActive = location && location.pathname.indexOf(withPrefix(to)) === 0;

  let className = "toc-item";
  if (isActive) {
    className += " toc-active";
  }
  className += props.className ? " " + props.className : "";

  return (
    <li className={className} data-sidebar-branch>
      <SmartLink to={to} className="d-block" data-sidebar-link>
        {title || children}
      </SmartLink>
      {title && children && !!children.length && (
        <ul className="list-unstyled" data-sidebar-tree>
          {children}
        </ul>
      )}
    </li>
  );
};
