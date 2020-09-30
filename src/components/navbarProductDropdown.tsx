import React from "react";
import { NavDropdown } from "react-bootstrap";
import { graphql, useStaticQuery } from "gatsby";

import SmartLink from "./smartLink";
import { sortPages } from "~src/utils";

const productNavQuery = graphql`
  query ProductNavQuery {
    allSitePage(
      filter: {
        path: { regex: "/^/product//" }
        context: { draft: { ne: false } }
      }
    ) {
      nodes {
        path
        context {
          title
          sidebar_order
        }
      }
    }
  }
`;

export default (): JSX.Element => {
  const data = useStaticQuery(productNavQuery);

  const matches = sortPages(
    data.allSitePage.nodes.filter(
      n => n.context && n.context.title && n.path.match(/\//g).length === 3
    )
  );

  return (
    <NavDropdown title="Product" id="nd-product">
      {matches.map(node => (
        <SmartLink to={node.path} key={node.path} className="dropdown-item">
          {node.context.title}
        </SmartLink>
      ))}
    </NavDropdown>
  );
};
