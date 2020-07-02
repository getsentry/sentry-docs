import { withPrefix } from "gatsby";
import React from "react";
import { useLocation } from "@reach/router";
import { StaticQuery, graphql } from "gatsby";

import SmartLink from "./smartLink";
import { sortBy } from "../utils";

const navQuery = graphql`
  query NavQuery {
    allFile(
      filter: {
        absolutePath: { regex: "/(/docs/|/collections/_documentation/)/" }
      }
    ) {
      nodes {
        childMarkdownRemark {
          frontmatter {
            title
            sidebar_order
            gatsby
          }
          fields {
            slug
            gatsbyOnly
          }
        }
        childMdx {
          frontmatter {
            title
            sidebar_order
          }
          fields {
            slug
            gatsbyOnly
          }
        }
      }
    }
  }
`;

const NavLink = ({ to, title, children, remote, ...props }) => {
  const location = useLocation();
  const isActive = location && location.pathname.indexOf(withPrefix(to)) === 0;

  let className = "toc-item";
  if (isActive) {
    className += " toc-active";
  }
  className += props.className ? " " + props.className : "";

  return (
    <li className={className} data-sidebar-branch>
      <SmartLink to={to} className="d-block" data-sidebar-link remote={remote}>
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

const toTree = nodeList => {
  const result = [];
  const level = { result };

  nodeList.forEach(node => {
    const slug = node.fields.slug;
    slug.split("/").reduce((r, name, i, a) => {
      if (!r[name]) {
        r[name] = { result: [] };
        r.result.push({ name, children: r[name].result, node });
      }

      return r[name];
    }, level);
  });

  return result[0].children;
};

const renderChildren = children => {
  return sortBy(
    children.filter(
      ({ name, node }) => !!node.frontmatter.title && name !== ""
    ),
    n => n.node.frontmatter.sidebar_order
  ).map(({ node, children }) => {
    return (
      <NavLink
        to={node.fields.slug}
        key={node.fields.slug}
        title={node.frontmatter.title}
        remote={!node.fields.gatsbyOnly}
      >
        {renderChildren(children)}
      </NavLink>
    );
  });
};

const DynamicNav = ({ root, title, tree, collapse = false }) => {
  // TODO(dcramer): this still needs to build the tree
  // love that we cant use filters here...
  const node = tree.find(n => n.name === root);
  const parentNode = node.children.find(n => n.name === "");

  const location = useLocation();
  const isActive =
    location && location.pathname.indexOf(withPrefix(`/${root}/`)) === 0;

  const headerClassName = "sidebar-title d-flex align-items-center mb-0";
  const header = parentNode ? (
    <SmartLink
      to={`/${root}/`}
      className={headerClassName}
      data-sidebar-link
      remote={!parentNode.node.fields.gatsbyOnly}
    >
      <h6>{title}</h6>
    </SmartLink>
  ) : (
    <div className={headerClassName} data-sidebar-link>
      <h6>{title}</h6>
    </div>
  );

  return (
    <li className="mb-3" data-sidebar-branch>
      {header}
      {(!collapse || isActive) && (
        <ul className="list-unstyled" data-sidebar-tree>
          {renderChildren(node.children)}
        </ul>
      )}
    </li>
  );
};

const Sidebar = () => {
  return (
    <StaticQuery
      query={navQuery}
      render={data => {
        const tree = toTree(
          sortBy(
            data.allFile.nodes
              .filter(n => !!(n.childMdx || n.childMarkdownRemark))
              .map(n => n.childMdx || n.childMarkdownRemark)
              // hide jekyll docs which indicate they're converted to gatsby
              // this avoids duplicating urls (which filter out in the tree, but might be the wrong node)
              .filter(n => !n.frontmatter.gatsby),
            n => n.fields.slug
          )
        );
        return (
          <ul className="list-unstyled" data-sidebar-tree>
            <DynamicNav
              root="error-reporting"
              title="Error Reporting"
              tree={tree}
            />
            <DynamicNav
              root="enriching-error-data"
              title="Enriching Error Data"
              tree={tree}
            />
            <DynamicNav
              root="performance-monitoring"
              title="Performance Monitoring"
              tree={tree}
            />
            <DynamicNav
              root="workflow"
              title="Workflow and Integrations"
              tree={tree}
            />
            <DynamicNav
              root="data-management"
              title="Data Management"
              tree={tree}
            />
            <DynamicNav
              root="accounts"
              title="Organizations and Projects"
              tree={tree}
            />
            <DynamicNav root="platforms" title="Platforms" tree={tree} />
            <DynamicNav root="meta" title="Security and Legal" tree={tree} />
            <DynamicNav
              root="cli"
              title="Command Line Interface"
              tree={tree}
              collapse
            />
            <DynamicNav root="api" title="API Reference" tree={tree} collapse />
            <DynamicNav
              root="clients"
              title="Legacy Clients"
              tree={tree}
              collapse
            />
            <DynamicNav root="guides" title="Guides" tree={tree} collapse />
            <DynamicNav root="support" title="Support" tree={tree} collapse />
            <li className="mb-3" data-sidebar-branch>
              <div
                className="sidebar-title d-flex align-items-center mb-0"
                data-sidebar-link
              >
                <h6>Resources</h6>
              </div>
              <ul className="list-unstyled" data-sidebar-tree>
                <NavLink to="https://develop.sentry.dev">
                  Developer Documentation
                </NavLink>
                <NavLink to="https://github.com/getsentry/onpremise">
                  Self-Hosting Sentry
                </NavLink>
              </ul>
            </li>
          </ul>
        );
      }}
    />
  );
};

export default Sidebar;
