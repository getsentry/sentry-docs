import React from 'react';
import {create} from 'react-test-renderer';

import {_setCachedCodeKeywords, CodeContextProvider, DEFAULTS} from '../codeContext';
import {makeKeywordsClickable} from '../codeKeywords';

function CodeWrapper({children, ...props}) {
  return <code {...props}>{children ? makeKeywordsClickable(children) : children}</code>;
}

describe('CodeWrapper', () => {
  beforeEach(() => {
    _setCachedCodeKeywords(DEFAULTS);
  });

  it('renders without placeholder', () => {
    const tree = create(
      <CodeContextProvider>
        <CodeWrapper>process.env.MY_ENV = 'foo'</CodeWrapper>
      </CodeContextProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders with placeholder', () => {
    const tree = create(
      <CodeContextProvider>
        <CodeWrapper>process.env.MY_ENV = ___ORG_SLUG___</CodeWrapper>
      </CodeContextProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders with placeholder in middle of text', () => {
    const tree = create(
      <CodeContextProvider>
        <CodeWrapper>process.env.MY_ENV = https://___ORG_SLUG___.sentry.io</CodeWrapper>
      </CodeContextProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders org auth token placeholder when not signed in', () => {
    const tree = create(
      <CodeContextProvider>
        <CodeWrapper>process.env.MY_ENV = ___ORG_AUTH_TOKEN___</CodeWrapper>
      </CodeContextProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders org auth token placeholder when signed in', () => {
    _setCachedCodeKeywords({...DEFAULTS, USER: {ID: 123, NAME: 'test@sentry.io'}});

    const tree = create(
      <CodeContextProvider>
        <CodeWrapper>process.env.MY_ENV = ___ORG_AUTH_TOKEN___</CodeWrapper>
      </CodeContextProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders multiple placeholders', () => {
    const tree = create(
      <CodeContextProvider>
        <CodeWrapper>
          process.env.MY_ENV = ___ORG_SLUG___ + ___PROJECT_SLUG___
        </CodeWrapper>
      </CodeContextProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
