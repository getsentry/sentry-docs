import {DocNode} from 'sentry-docs/docTree';

import styles from './style.module.scss';

import {SmartLink} from '../smartLink';

type BreadcrumbsProps = {
  leafNode: DocNode;
};

export function Breadcrumbs({leafNode}: BreadcrumbsProps) {
  const nodes: DocNode[] = [];
  for (let node: DocNode | undefined = leafNode; node; node = node.parent) {
    if (node && !node.missing) {
      nodes.unshift(node);
    }
  }

  return (
    <ul className="list-none flex p-0 flex-wrap" style={{margin: 0}}>
      {nodes.map(n => {
        const to = n.path === '/' ? n.path : `/${n.path}/`;
        return (
          <li className={styles['breadcrumb-item']} key={n.path}>
            <SmartLink to={to}>{n.frontmatter.title}</SmartLink>
          </li>
        );
      })}
    </ul>
  );
}
