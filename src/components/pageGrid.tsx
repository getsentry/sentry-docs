import React from 'react';
import {useLocation} from '@reach/router';
import {graphql, useStaticQuery} from 'gatsby';

import {sortPages} from 'sentry-docs/utils';

import SmartLink from './smartLink';

const query = graphql`
  query PageGridQuery {
    allSitePage(filter: {context: {draft: {ne: true}}}) {
      nodes {
        path
        context {
          description
          title
          sidebar_order
        }
      }
    }
  }
`;

type Props = {
  nextPages: boolean;
  /**
   * A list of pages to exclude from the grid.
   * Specify the file name of the page, for example, "index" for "index.mdx"
   */
  exclude?: string[];
  header?: string;
};

export default function PageGrid({
  nextPages = false,
  header,
  exclude,
}: Props): JSX.Element {
  const data = useStaticQuery(query);
  const location = useLocation();

  const currentPath = location.pathname;
  const currentPathLen = currentPath.length;

  let matches = sortPages(
    data.allSitePage.nodes.filter(
      n =>
        n.context &&
        n.context.title &&
        n.path.indexOf(currentPath) === 0 &&
        n.path.slice(currentPathLen).split('/', 2)[1] === ''
    )
  );

  if (nextPages) {
    const currentPage = matches.find(n => n.path === currentPath);
    if (currentPage) {
      matches = matches.slice(matches.indexOf(currentPage));
    }
  } else {
    matches = matches.filter(n => n.path !== currentPath);
  }

  if (exclude && exclude.length) {
    exclude.forEach(e => {
      matches = matches.filter(n => !n.path.endsWith(`${e}/`));
    });
  }

  if (!matches.length) {
    return null;
  }

  return (
    <nav>
      {header && <h2>{header}</h2>}
      <ul>
        {matches.map(n => (
          <li key={n.path} style={{marginBottom: '1rem'}}>
            <h4 style={{marginBottom: 0}}>
              <SmartLink to={n.path}>{n.context.title}</SmartLink>
            </h4>
            {n.context.description ?? <p>{n.context.description}</p>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
