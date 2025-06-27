import {Fragment} from 'react';

import {getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from './dynamicNav';
import {PlatformSidebar} from './platformSidebar';
import {ProductSidebar} from './productSidebar';
import {SidebarSeparator} from './sidebarLink';
import {NavNode} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

export async function SidebarNavigation({path}: {path: string[]}) {
  const rootNode = await getDocsRootNode();

  // Product section: just show the sidebar for /product/ and its children
  if (path[0] === 'product') {
    return (
      <ProductSidebar rootNode={rootNode} items={[{title: 'Product', root: 'product'}]} />
    );
  }

  // SDKs/Platforms
  if (path[0] === 'platforms') {
    const platformName = path[1];
    const guideName = path[3];
    return (
      <Fragment>
        {platformName && (
          <Fragment>
            <PlatformSidebar
              platformName={platformName}
              guideName={guideName}
              rootNode={rootNode}
            />
            <SidebarSeparator />
          </Fragment>
        )}
      </Fragment>
    );
  }

  // Concepts & Reference
  if (path[0] === 'concepts') {
    return (
      <ul data-sidebar-tree>
        <DynamicNav
          root="concepts/key-terms"
          title="Key Terms"
          tree={toTree(
            getNavNodes([nodeForPath(rootNode, 'concepts/key-terms')!], docNodeToNavNode)
          )}
          collapsible={false}
        />
        <DynamicNav
          root="concepts/search"
          title="Search"
          tree={toTree(
            getNavNodes([nodeForPath(rootNode, 'concepts/search')!], docNodeToNavNode)
          )}
          collapsible={false}
        />
        <DynamicNav
          root="concepts/migration"
          title="Migration"
          tree={toTree(
            getNavNodes([nodeForPath(rootNode, 'concepts/migration')!], docNodeToNavNode)
          )}
          collapsible={false}
        />
        <DynamicNav
          root="concepts/data-management"
          title="Data Management"
          tree={toTree(
            getNavNodes(
              [nodeForPath(rootNode, 'concepts/data-management')!],
              docNodeToNavNode
            )
          )}
          collapsible={false}
        />
        <DynamicNav
          root="cli"
          title="Sentry CLI"
          tree={toTree(getNavNodes([nodeForPath(rootNode, 'cli')!], docNodeToNavNode))}
          collapsible={false}
        />
      </ul>
    );
  }

  // Admin Settings
  if (path[0] === 'organization' || path[0] === 'account' || path[0] === 'pricing') {
    const adminItems = [
      {title: 'Account Settings', root: 'account'},
      {title: 'Organization Settings', root: 'organization'},
      {title: 'Pricing & Billing', root: 'pricing'},
    ];
    return <ProductSidebar rootNode={rootNode} items={adminItems} />;
  }

  // Security, Legal, & PII
  if (path[0] === 'security-legal-pii') {
    return (
      <ul data-sidebar-tree>
        <DynamicNav
          root="security-legal-pii"
          title="Security, Legal, & PII"
          tree={toTree(
            getNavNodes([nodeForPath(rootNode, 'security-legal-pii')!], docNodeToNavNode)
          )}
          collapsible={false}
        />
      </ul>
    );
  }

  // API Reference
  if (path[0] === 'api') {
    return (
      <ul data-sidebar-tree>
        <DynamicNav
          root="api"
          title="API Reference"
          tree={toTree(getNavNodes([nodeForPath(rootNode, 'api')!], docNodeToNavNode))}
          collapsible={false}
        />
      </ul>
    );
  }

  // Contributing pages
  if (path[0] === 'contributing') {
    const contribNode = nodeForPath(rootNode, 'contributing');
    if (contribNode) {
      const contribNodes: NavNode[] = getNavNodes([contribNode], docNodeToNavNode);
      return (
        <ul data-sidebar-tree>
          <DynamicNav
            root="contributing"
            title="Contributing to Docs"
            tree={toTree(contribNodes)}
          />
        </ul>
      );
    }
  }

  // Sentry CLI (standalone route)
  if (path[0] === 'cli') {
    return (
      <ul data-sidebar-tree>
        <DynamicNav
          root="concepts/key-terms"
          title="Key Terms"
          tree={toTree(
            getNavNodes([nodeForPath(rootNode, 'concepts/key-terms')!], docNodeToNavNode)
          )}
          collapsible={false}
        />
        <DynamicNav
          root="concepts/search"
          title="Search"
          tree={toTree(
            getNavNodes([nodeForPath(rootNode, 'concepts/search')!], docNodeToNavNode)
          )}
          collapsible={false}
        />
        <DynamicNav
          root="concepts/migration"
          title="Migration"
          tree={toTree(
            getNavNodes([nodeForPath(rootNode, 'concepts/migration')!], docNodeToNavNode)
          )}
          collapsible={false}
        />
        <DynamicNav
          root="concepts/data-management"
          title="Data Management"
          tree={toTree(
            getNavNodes(
              [nodeForPath(rootNode, 'concepts/data-management')!],
              docNodeToNavNode
            )
          )}
          collapsible={false}
        />
        <DynamicNav
          root="cli"
          title="Sentry CLI"
          tree={toTree(getNavNodes([nodeForPath(rootNode, 'cli')!], docNodeToNavNode))}
          collapsible={false}
        />
      </ul>
    );
  }

  // This should never happen, all cases need to be handled above
  throw new Error(`Unknown path: ${path.join('/')} - cannot render sidebar`);
}
