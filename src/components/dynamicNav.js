import { withPrefix } from "gatsby";
import React from "react";
import { useLocation } from "@reach/router";

import SmartLink from "./smartLink";
import SidebarLink from "./sidebarLink";
import { sortBy } from "../utils";

export const toTree = nodeList => {
  const result = [];
  const level = { result };

  nodeList.forEach(node => {
    let curPath = "";
    node.path.split("/").reduce((r, name, i, a) => {
      curPath += `${name}/`;
      if (!r[name]) {
        r[name] = { result: [] };
        r.result.push({
          name,
          children: r[name].result,
          node: curPath === node.path ? node : null,
        });
      }

      return r[name];
    }, level);
  });

  return result[0].children;
};

export const renderChildren = (children, exclude) => {
  return sortBy(
    children.filter(
      ({ name, node }) =>
        node &&
        !!node.context.title &&
        name !== "" &&
        exclude.indexOf(node.path) === -1
    ),
    n => n.node.context.sidebar_order
  ).map(({ node, children }) => {
    return (
      <SidebarLink to={node.path} key={node.path} title={node.context.title}>
        {renderChildren(children, exclude)}
      </SidebarLink>
    );
  });
};

export default ({
  root,
  title,
  tree,
  collapse = false,
  exclude = [],
  prependLinks = [],
  noHeadingLink = false,
}) => {
  if (root.indexOf("/") === 0) root = root.substr(1);

  let entity;
  let currentTree = tree;
  let rootBits = root.split("/");
  rootBits.forEach(bit => {
    entity = currentTree.find(n => n.name === bit);
    if (!entity) {
      throw new Error(
        `Could not find entity at ${root} (specifically at ${bit})`
      );
    }
    currentTree = entity.children;
  });
  if (!title) title = entity.node.context.title;
  const parentNode = entity.children
    ? entity.children.find(n => n.name === "")
    : null;

  const location = useLocation();
  const isActive =
    location && location.pathname.indexOf(withPrefix(`/${root}/`)) === 0;

  const headerClassName = "sidebar-title d-flex align-items-center mb-0";
  const header =
    parentNode && !noHeadingLink ? (
      <SmartLink
        to={`/${root}/`}
        className={headerClassName}
        activeClassName=""
        data-sidebar-link
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
      {(!collapse || isActive) && entity.children && (
        <ul className="list-unstyled" data-sidebar-tree>
          {prependLinks &&
            prependLinks.map(link => (
              <SidebarLink to={link[0]} key={link[0]}>
                {link[1]}
              </SidebarLink>
            ))}
          {renderChildren(entity.children, exclude)}
        </ul>
      )}
    </li>
  );
};
