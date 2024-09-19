'use client';

import {Children, cloneElement, ReactElement} from 'react';

import {KeywordSelector} from './keywordSelector';
import {OrgAuthTokenCreator} from './orgAuthTokenCreator';

export const KEYWORDS_REGEX = /\b___(?:([A-Z_][A-Z0-9_]*)\.)?([A-Z_][A-Z0-9_]*)___\b/g;

export const ORG_AUTH_TOKEN_REGEX = /___ORG_AUTH_TOKEN___/g;

type ChildrenItem = ReturnType<typeof Children.toArray>[number] | React.ReactNode;

export function makeKeywordsClickable(children: React.ReactNode) {
  const items = Children.toArray(children);

  return items.reduce((arr: ChildrenItem[], child) => {
    if (typeof child !== 'string') {
      const updatedChild = cloneElement(
        child as ReactElement,
        {},
        makeKeywordsClickable((child as ReactElement).props.children)
      );
      arr.push(updatedChild);
      return arr;
    }
    if (ORG_AUTH_TOKEN_REGEX.test(child)) {
      makeOrgAuthTokenClickable(arr, child);
    } else if (KEYWORDS_REGEX.test(child)) {
      makeProjectKeywordsClickable(arr, child);
    } else {
      arr.push(child);
    }

    return arr;
  }, [] as ChildrenItem[]);
}

function makeOrgAuthTokenClickable(arr: ChildrenItem[], str: string) {
  runRegex(arr, str, ORG_AUTH_TOKEN_REGEX, lastIndex => (
    <OrgAuthTokenCreator key={`org-token-${lastIndex}`} />
  ));
}

function makeProjectKeywordsClickable(arr: ChildrenItem[], str: string) {
  runRegex(arr, str, KEYWORDS_REGEX, (lastIndex, match) => (
    <KeywordSelector
      key={`project-keyword-${lastIndex}`}
      index={lastIndex}
      group={match[1] || 'PROJECT'}
      keyword={match[2]}
    />
  ));
}

function runRegex(
  arr: ChildrenItem[],
  str: string,
  regex: RegExp,
  cb: (lastIndex: number, match: RegExpExecArray) => React.ReactNode
): void {
  regex.lastIndex = 0;

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(str)) !== null) {
    const afterMatch = regex.lastIndex - match[0].length;
    const before = str.substring(lastIndex, afterMatch);

    if (before.length > 0) {
      arr.push(before);
    }

    arr.push(cb(lastIndex, match));

    lastIndex = regex.lastIndex;
  }

  const after = str.substring(lastIndex);
  if (after.length > 0) {
    arr.push(after);
  }
}
