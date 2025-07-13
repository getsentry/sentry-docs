'use client';

import {Children, cloneElement, ReactElement, useEffect, useRef, useState, isValidElement} from 'react';
import {Check, Clipboard} from 'react-feather';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/nextjs';

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
    if (typeof child !== 'object' || !isValidElement(child)) {
      arr.push(child);
      return arr;
    }

    const element = child as ReactElement;
    const classes = element.props?.className;

    const isCodeLine = classes && classes.includes('code-line');
    if (!isCodeLine) {
      const updatedChild = cloneElement(
        element,
        element.props,
        makeHighlightBlocks(element.props?.children, language)
      );
      arr.push(updatedChild);
      return arr;
    }

    const isHighlightedLine = isCodeLine && classes.includes('highlight-line');

    if (isHighlightedLine) {
      highlightedLineElements.push(element);

      // If it's the last line that's highlighted, push it
      if (index === items.length - 1) {
        arr.push(
          <HighlightBlock key={highlightElementGroupCounter} language={language}>
            {...highlightedLineElements}
          </HighlightBlock>
        );
      }
    } else {
      // Check for an opened highlight group before pushing the new line
      if (highlightedLineElements.length > 0) {
        arr.push(
          <HighlightBlock key={highlightElementGroupCounter} language={language}>
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
  language,
}: {
  children: React.ReactNode;
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
      Sentry.captureException(error);
      setCopied(false);
    }
  }

  return (
    <HighlightBlockContainer className="highlight-block">
      <CodeLinesContainer ref={codeRef}>{children}</CodeLinesContainer>
      <ClipBoardContainer onClick={copyCodeOnClick}>
        {showCopyButton && !copied && (
          <Clipboard size={16} opacity={0.2} stroke={'white'} />
        )}
        {showCopyButton && copied && <Check size={16} stroke={'green'} />}
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

  border: 1px solid var(--accent-11);
  border-left: 4px solid var(--accent-purple);
  border-radius: 6px;

  .highlight-line {
    padding-left: 8px !important;
  }

  padding: 2px 0;

  :hover svg {
    opacity: 1;
  }
  svg {
    transition: all 150ms linear;
    padding-bottom: 1px;
  }
`;

const CodeLinesContainer = styled('div')`
  width: calc(100% - 48px);
`;

const ClipBoardContainer = styled('div')`
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
