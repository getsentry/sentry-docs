'use client';

import {
  Children,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/styled';

import {CodeBlockProps} from './codeBlock';
import {CodeContext} from './codeContext';
import {KEYWORDS_REGEX, ORG_AUTH_TOKEN_REGEX} from './codeKeywords';
import {SignInNote} from './signInNote';

// human readable versions of names
const HUMAN_LANGUAGE_NAMES = {
  coffee: 'CoffeeScript',
  cpp: 'C++',
  csharp: 'C#',
  es6: 'JavaScript (ES6)',
  fsharp: 'F#',
  html: 'HTML',
  javascript: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  tsx: 'TSX',
  php: 'PHP',
  powershell: 'PowerShell',
  typescript: 'TypeScript',
  yaml: 'YAML',
  yml: 'YAML',
};

interface CodeTabProps {
  children: React.ReactElement<CodeBlockProps> | React.ReactElement<CodeBlockProps>[];
}

const showSigninNote = (children: ReactNode) => {
  return Children.toArray(children).some(node => {
    if (typeof node === 'string') {
      return KEYWORDS_REGEX.test(node) || ORG_AUTH_TOKEN_REGEX.test(node);
    }
    return showSigninNote((node as ReactElement).props.children);
  });
};

export function CodeTabs({children}: CodeTabProps) {
  const codeBlocks = Array.isArray(children) ? [...children] : [children];

  // The title is what we use for sorting and also for remembering the
  // selection. If there is no title fall back to the title cased language name
  // (or override from `LANGUAGES`).
  const possibleChoices = codeBlocks.map<string>(({props: {title, language}}) => {
    if (title) {
      return title;
    }
    if (!language) {
      return 'Text';
    }
    if (language in HUMAN_LANGUAGE_NAMES) {
      return HUMAN_LANGUAGE_NAMES[language];
    }

    return language[0].toUpperCase() + language.substring(1);
  });
  const groupId = 'Tabgroup:' + possibleChoices.slice().sort().join('|');

  const codeContext = useContext(CodeContext);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [lastScrollOffset, setLastScrollOffset] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // When the selection switches we scroll so that the box that was toggled
  // stays scrolled like it was before. This is because boxes above the changed
  // box might also toggle and change height.
  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    if (lastScrollOffset !== null) {
      const diff = containerRef.current.getBoundingClientRect().y - lastScrollOffset;
      window.scroll(window.scrollX, window.scrollY + diff);
      setLastScrollOffset(null);
    }
  }, [lastScrollOffset]);

  // Update local tab state whenever global context changes
  useEffect(() => {
    const newSelection = possibleChoices.findIndex(
      choice => codeContext?.storedCodeSelection[groupId] === choice
    );
    if (newSelection !== -1) {
      setSelectedTabIndex(newSelection);
    }
  }, [codeContext?.storedCodeSelection, groupId, possibleChoices]);

  const buttons = possibleChoices.map((choice, idx) => (
    <TabButton
      key={idx}
      data-active={choice === possibleChoices[selectedTabIndex]}
      onClick={() => {
        if (containerRef.current) {
          // see useEffect above.
          setLastScrollOffset(containerRef.current.getBoundingClientRect().y);
        }
        codeContext?.updateCodeSelection({groupId, selection: choice});
      }}
    >
      {choice}
    </TabButton>
  ));

  return (
    <Container ref={containerRef}>
      {showSigninNote(codeBlocks[selectedTabIndex]) && <SignInNote />}
      <TabBar>{buttons}</TabBar>
      <div className="relative" data-sentry-mask>
        {codeBlocks[selectedTabIndex]}
      </div>
    </Container>
  );
}

const Container = styled('div')`
  margin-bottom: 1.5rem;

  pre[class*='language-'] {
    padding: 10px 12px;
    border-radius: 0 0 3px 3px;
  }
`;

const TabBar = styled('div')`
  background: var(--code-background);
  border-bottom: 1px solid #40364a;
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  border-radius: 3px 3px 0 0;
`;

const TabButton = styled('button')`
  color: #9481a4;
  padding: 7px 6px 4px;
  display: inline-block;
  cursor: pointer;
  border: none;
  font-size: 0.75rem;
  background: none;
  outline: none;
  border-bottom: 3px solid transparent;

  &:focus,
  &[data-active='true'] {
    color: #fff;
    font-weight: 500;
    border-bottom-color: #6c5fc7;
  }
`;
