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

  // Product sections
  if (path[0] === 'product' || path[0] === 'product/sentry' || path[0] === 'product/sentry-prevent' || path[0] === 'product/seer') {
    const productItems = [
      {title: 'Sentry', root: 'product/sentry'},
      {title: 'Sentry Prevent', root: 'product/sentry-prevent'},
      {title: 'Seer', root: 'product/seer'},
    ];
    return <ProductSidebar rootNode={rootNode} items={productItems} />;
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
          root="concepts"
          title="Concepts & Reference"
          tree={toTree(getNavNodes([nodeForPath(rootNode, 'concepts')!], docNodeToNavNode))}
          collapsible={false}
        />
      </ul>
    );
  }

  // Admin Settings
  if (path[0] === 'organization' || path[0] === 'account') {
    const adminItems = [
      {title: 'Account Settings', root: 'account'},
      {title: 'Organization Settings', root: 'organization'},
    ];
    return <ProductSidebar rootNode={rootNode} items={adminItems} />;
  }

  // Pricing & Billing
  if (path[0] === 'pricing') {
    return (
      <ul data-sidebar-tree>
        <DynamicNav
          root="pricing"
          title="Pricing & Billing"
          tree={toTree(getNavNodes([nodeForPath(rootNode, 'pricing')!], docNodeToNavNode))}
          collapsible={false}
        />
      </ul>
    );
  }

  // Sentry CLI
  if (path[0] === 'cli') {
    return (
      <ul data-sidebar-tree>
        <DynamicNav
          root="cli"
          title="Sentry CLI"
          tree={toTree(getNavNodes([nodeForPath(rootNode, 'cli')!], docNodeToNavNode))}
          collapsible={false}
        />
      </ul>
    );
  }

  // Sentry API
  if (path[0] === 'api') {
    return (
      <ul data-sidebar-tree>
        <DynamicNav
          root="api"
          title="Sentry API"
          tree={toTree(getNavNodes([nodeForPath(rootNode, 'api')!], docNodeToNavNode))}
          collapsible={false}
        />
      </ul>
    );
  }

  // Security, Legal, & PII
  if (path[0] === 'security-legal-pii') {
    return (
      <ul data-sidebar-tree>
        <DynamicNav
          root="security-legal-pii"
          title="Security, Legal, & PII"
          tree={toTree(getNavNodes([nodeForPath(rootNode, 'security-legal-pii')!], docNodeToNavNode))}
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

  // This should never happen, all cases need to be handled above
  throw new Error(`Unknown path: ${path.join('/')} - cannot render sidebar`);
}
