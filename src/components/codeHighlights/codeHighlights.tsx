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
  let highlightElementGroupCounter = 0;

  return items.reduce((arr: ChildrenItem[], child, index) => {
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
        element.props,
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
          <HighlightBlock groupId={highlightElementGroupCounter} key={highlightElementGroupCounter} language={language}>
            {...highlightedLineElements}
          </HighlightBlock>
        );
        highlightedLineElements = [];
        ++highlightElementGroupCounter;
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

  const [copied, setCopied] = useState(false);

  async function copyCodeOnClick() {
    if (codeRef.current === null) {
      return;
    }

    const code = cleanCodeSnippet(codeRef.current.innerText, {language});

    try {
      setCopied(false);
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy:', error);
    }
  }

  return (
    <HighlightBlockContainer>
      <CodeLinesContainer ref={codeRef}>{children}</CodeLinesContainer>
      <ClipBoardContainer onClick={copyCodeOnClick} className=".clipboard">
        {showCopyButton && (
          <Clipboard
            size={16}
            opacity={copied ? 1 : 0.15}
            stroke={copied ? 'green' : 'white'}
          />
        )}
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
  position: relative;

  :hover svg {
    opacity: 1;
  }
  svg {
    transition: all 150ms linear;
  }
`;

const CodeLinesContainer = styled('div')`
  padding: 8px 0;
  width: calc(100% - 48px);
`;

const ClipBoardContainer = styled('div')`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
