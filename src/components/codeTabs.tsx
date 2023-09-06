import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from '@emotion/styled';

import {CodeBlockProps} from './codeBlock';
import {CodeContext} from './codeContext';

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
  php: 'PHP',
  powershell: 'PowerShell',
  typescript: 'TypeScript',
  yaml: 'YAML',
  yml: 'YAML',
};

interface CodeTabProps {
  children: React.ReactElement<CodeBlockProps> | React.ReactElement<CodeBlockProps>[];
}

export function CodeTabs({children}: CodeTabProps) {
  const codeBlocks = Array.isArray(children) ? [...children] : [children];

  // the idea here is that we have two selection states.  The shared selection
  // always wins unless what is in the shared selection does not exist on the
  // individual code block. In that case the local selection overrides.  The
  // final selection is what is then rendered.

  const codeContext = useContext(CodeContext);
  const [localSelection, setLocalSelection] = useState<string | null>(null);
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

  // disambiguate duplicates by enumerating them.
  const tabTitleSeen: Record<string, number> = {};

  possibleChoices.forEach((tabTitle, index) => {
    const hasMultiple = possibleChoices.filter(x => x === tabTitle).length > 1;

    if (hasMultiple) {
      tabTitleSeen[tabTitle] ??= 0;
      tabTitleSeen[tabTitle] += 1;
      possibleChoices[index] = `${tabTitle} ${tabTitleSeen[tabTitle]}`;
    }
  });

  const [sharedSelection, setSharedSelection] = codeContext?.sharedCodeSelection ?? [];

  const sharedSelectionChoice = sharedSelection
    ? possibleChoices.find(x => x === sharedSelection)
    : null;
  const localSelectionChoice = localSelection
    ? possibleChoices.find(x => x === localSelection)
    : null;

  // Prioritize sharedSelectionChoice over the local selection
  const finalSelection =
    sharedSelectionChoice ?? localSelectionChoice ?? possibleChoices[0];

  // Whenever local selection and the final selection are not in sync, the local
  // selection is updated from the final one.  This means that when the shared
  // selection moves to something that is unsupported by the block it stays on
  // its last selection.
  useEffect(() => setLocalSelection(finalSelection), [finalSelection]);

  const selectedIndex = possibleChoices.indexOf(finalSelection);
  const code = codeBlocks[selectedIndex];

  const buttons = possibleChoices.map((choice, idx) => (
    <TabButton
      key={idx}
      data-active={choice === finalSelection || possibleChoices.length === 1}
      onClick={() => {
        if (containerRef.current) {
          // see useEffect above.
          setLastScrollOffset(containerRef.current.getBoundingClientRect().y);
        }
        setSharedSelection?.(choice);
        setLocalSelection(choice);
      }}
    >
      {choice}
    </TabButton>
  ));

  return (
    <Container ref={containerRef}>
      <TabBar>{buttons}</TabBar>
      <div className="tab-content">{code}</div>
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
  background: #251f3d;
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
