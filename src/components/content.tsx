import React from 'react';

import {Markdown} from './markdown';

type FileNode = {
  childMarkdownRemark?: {
    html: any;
  };
  childMdx?: {
    body: any;
  };
};

type Props = {
  file: FileNode;
};

// https://github.com/gatsbyjs/gatsby/issues/12413
function RawHtml({html}) {
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

export function Content({file}: Props): JSX.Element | null {
  if (!file) {
    return null;
  }
  const child = file.childMarkdownRemark || file.childMdx;
  if (!child) {
    return null;
  }
  if (file.childMarkdownRemark) {
    return <RawHtml html={file.childMarkdownRemark.html} />;
  }
  if (file.childMdx) {
    return <Markdown value={file.childMdx.body} />;
  }
  return null;
}
