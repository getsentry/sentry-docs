'use client';

import {Children, cloneElement, ReactElement, useEffect, useRef, useState} from 'react';
import {Clipboard} from 'react-feather';
import styled from '@emotion/styled';

import {cleanCodeSnippet, useCleanSnippetInClipboard} from '../codeBlock';

type ChildrenItem = ReturnType<typeof Children.toArray>[number] | React.ReactNode;

export function makeHighlightBlocks(
  children: React.ReactNode,
  language: string | undefined
) {
  const items = Children.toArray(children);

  let highlightedLineElements: ReactElement[] = [];
  const highlightElementGroupCounter = 0;

  return items.reduce((arr: ChildrenItem[], child) => {
    if (typeof child !== 'object') {
      arr.push(child);
      return arr;
    }

    const element = child as ReactElement;
    const classes = element.props.className;

    const isCodeLine = classes && classes.includes('code-line');
    if (!isCodeLine) {
      const updatedChild = cloneElement(
        child as ReactElement,
        {},
        makeHighlightBlocks((child as ReactElement).props.children, language)
      );
      arr.push(updatedChild);
      return arr;
    }

    const isHighlightedLine = isCodeLine && classes.includes('highlight-line');

    if (isHighlightedLine) {
      highlightedLineElements.push(element);
    } else {
      if (highlightedLineElements.length > 0) {
        arr.push(
          <HighlightBlock groupId={highlightElementGroupCounter} language={language}>
            {...highlightedLineElements}
          </HighlightBlock>
        );
        highlightedLineElements = [];
      }
      arr.push(child);
    }

    return arr;
  }, [] as ChildrenItem[]);
}

export function HighlightBlock({
  children,
  groupId,
  language,
}: {
  children: React.ReactNode;
  groupId: number;
  language: string | undefined;
}) {
  const codeRef = useRef<HTMLDivElement>(null);

  useCleanSnippetInClipboard(codeRef, {language});

  // Show the copy button after js has loaded
  // otherwise the copy button will not work
  const [showCopyButton, setShowCopyButton] = useState(false);
  useEffect(() => {
    setShowCopyButton(true);
  }, []);

  async function copyCodeOnClick() {
    if (codeRef.current === null) {
      return;
    }

    const code = cleanCodeSnippet(codeRef.current.innerText, {language});

    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy:', error);
    }
  }

  return (
    <HighlightBlockContainer key={`highlight-block-${groupId}`}>
      <CodeLinesContainer ref={codeRef}>{children}</CodeLinesContainer>
      <ClipBoardContainer onClick={copyCodeOnClick}>
        {showCopyButton && <Clipboard size={14} opacity={70} />}
      </ClipBoardContainer>
    </HighlightBlockContainer>
  );
}

const HighlightBlockContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  float: left;
  min-width: 100%;
  box-sizing: border-box;
  background-color: rgba(239, 239, 239, 0.06);
`;

const CodeLinesContainer = styled('div')`
  padding: 8px 0;
  width: calc(100% - 48px);
`;

const ClipBoardContainer = styled('div')`
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    background-color: rgba(239, 239, 239, 0.1);
  }
  :active {
    background-color: rgba(239, 239, 239, 0.15);
  }
  transition: background-color 150ms linear;
`;
