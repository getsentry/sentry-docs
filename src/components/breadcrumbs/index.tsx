import {DocNode} from 'sentry-docs/docTree';

import styles from './style.module.scss';

import {SmartLink} from '../smartLink';

type BreadcrumbsProps = {
  leafNode: DocNode;
};

export function Breadcrumbs({leafNode}: BreadcrumbsProps) {
  const breadcrumbs: {title: string; to: string}[] = [];

  for (let node: DocNode | undefined = leafNode; node; node = node.parent) {
    if (node && !node.missing) {
      const to = node.path === '/' ? node.path : `/${node.path}/`;
      const title = node.frontmatter.sidebar_title ?? node.frontmatter.title;

      breadcrumbs.unshift({
        to,
        title,
      });
    }
  }

  return (
    <ul className="list-none flex p-0 flex-wrap float-left" style={{margin: 0}}>
      {breadcrumbs.map(b => {
        return (
          <li className={styles['breadcrumb-item']} key={b.to}>
            <SmartLink to={b.to}>{b.title}</SmartLink>
          </li>
        );
      })}
    </ul>
  );
}
