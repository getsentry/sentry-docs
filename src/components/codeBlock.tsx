import React, { useState, useRef, useContext } from "react";
import styled from "@emotion/styled";
import copy from "copy-to-clipboard";
import { MDXProvider } from "@mdx-js/react";
import { Clipboard, ArrowDown } from "react-feather";
import { AnimatePresence, motion } from "framer-motion";
import { usePopper } from "react-popper";
import memoize from "lodash/memoize";

import { useOnClickOutside } from "../utils";
import CodeContext from "./codeContext";
import ReactDOM from "react-dom";

const KEYWORDS_REGEX = /\b___(?:([A-Z_][A-Z0-9_]*)\.)?([A-Z_][A-Z0-9_]*)___\b/g;

function makeKeywordsClickable(children: React.ReactChildren) {
  const items = React.Children.toArray(children);

  KEYWORDS_REGEX.lastIndex = 0;

  return items.reduce((arr: any[], child) => {
    if (typeof child !== "string") {
      arr.push(child);
      return arr;
    }

    let match;
    let lastIndex = 0;
    while ((match = KEYWORDS_REGEX.exec(child)) !== null) {
      const afterMatch = KEYWORDS_REGEX.lastIndex - match[0].length;
      const before = child.substring(lastIndex, afterMatch);
      if (before.length > 0) {
        arr.push(before);
      }
      arr.push(
        <KeywordSelector
          group={match[1] || "PROJECT"}
          keyword={match[2]}
          index={lastIndex}
        />
      );
      lastIndex = KEYWORDS_REGEX.lastIndex;
    }

    const after = child.substr(lastIndex);
    if (after.length > 0) {
      arr.push(after);
    }

    return arr;
  }, []);
}

const getPortal = memoize(
  (): HTMLElement => {
    if (typeof document === "undefined") {
      return null;
    }

    let portal = document.getElementById("selector-portal");
    if (!portal) {
      portal = document.createElement("div");
      portal.setAttribute("id", "selector-portal");
      document.body.appendChild(portal);
    }
    return portal;
  }
);

type KeywordSelectorProps = {
  group: string;
  keyword: string;
  index: number;
};

function KeywordSelector({ keyword, group, index }: KeywordSelectorProps) {
  const codeContext = useContext(CodeContext);

  const [isOpen, setIsOpen] = useState(false);
  const [referenceEl, setReferenceEl] = useState(null);
  const [dropdownEl, setDropdownEl] = useState(null);

  const { styles, state, attributes } = usePopper(referenceEl, dropdownEl, {
    placement: "bottom",
    modifiers: [
      {
        name: "offset",
        options: { offset: [0, 10] },
      },
      { name: "arrow" },
    ],
  });

  useOnClickOutside({ current: dropdownEl }, () => isOpen && setIsOpen(false));

  const [
    sharedSelection,
    setSharedSelection,
  ] = codeContext.sharedKeywordSelection;

  const { codeKeywords } = useContext(CodeContext);
  const choices = codeKeywords?.[group] ?? [];
  const currentSelectionIdx = sharedSelection[group] ?? 0;
  const currentSelection = choices[currentSelectionIdx];

  if (!currentSelection) {
    return <React.Fragment>keyword</React.Fragment>;
  }

  const [isAnimating, setIsAnimating] = useState(false);

  const selector = isOpen && (
    <PositionWrapper
      style={styles.popper}
      ref={setDropdownEl}
      {...attributes.popper}
    >
      <AnimatedContainer>
        <Arrow
          style={styles.arrow}
          data-placement={state?.placement}
          data-popper-arrow
        />
        <Selections>
          {choices.map((item, idx) => {
            const isActive = idx === currentSelectionIdx;
            return (
              <ItemButton
                key={idx}
                isActive={isActive}
                onClick={() => {
                  const newSharedSelection = { ...sharedSelection };
                  newSharedSelection[group] = idx;
                  setSharedSelection(newSharedSelection);
                  setIsOpen(false);
                }}
              >
                {item.title}
              </ItemButton>
            );
          })}
        </Selections>
      </AnimatedContainer>
    </PositionWrapper>
  );

  const portal = getPortal();

  return (
    <React.Fragment>
      <KeywordDropdown
        key={index}
        ref={setReferenceEl}
        role="button"
        tabIndex={0}
        title={currentSelection?.title}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={e => e.key === "Enter" && setIsOpen(!isOpen)}
      >
        <KeywordIndicator isOpen={isOpen} />
        <span
          style={{
            // We set inline-grid only when animating the keyword so they
            // correctly overlap during animations, but this must be removed
            // after so copy-paste correctly works.
            display: isAnimating ? "inline-grid" : undefined,
          }}
        >
          <AnimatePresence initial={false}>
            <Keyword
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}
              key={currentSelectionIdx}
            >
              {currentSelection[keyword]}
            </Keyword>
          </AnimatePresence>
        </span>
      </KeywordDropdown>
      {portal &&
        ReactDOM.createPortal(
          <AnimatePresence>{selector}</AnimatePresence>,
          portal
        )}
    </React.Fragment>
  );
}

const Keyword = styled(motion.span)`
  grid-row: 1;
  grid-column: 1;
`;

Keyword.defaultProps = {
  initial: { position: "absolute", opacity: 0, y: -10 },
  animate: {
    position: "relative",
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 },
  },
  exit: { opacity: 0, y: 20 },
  transition: {
    opacity: { duration: 0.15 },
    y: { duration: 0.25 },
  },
};

const KeywordDropdown = styled("span")`
  border-radius: 3px;
  margin: 0 2px;
  padding: 0 4px;
  z-index: -1;
  cursor: pointer;
  background: #382f5c;
  transition: background 200ms ease-in-out;

  &:focus {
    outline: none;
  }

  &:focus,
  &:hover {
    background: #1d1127;
  }
`;

const KeywordIndicator = styled(ArrowDown)<{ isOpen: boolean }>`
  user-select: none;
  margin-right: 2px;
  transition: transform 200ms ease-in-out;
  transform: rotate(${(p) => (p.isOpen ? "180deg" : "0")});
  stroke-width: 3px;
  position: relative;
  top: -1px;
`;

KeywordIndicator.defaultProps = {
  size: "12px",
};

const PositionWrapper = styled("div")`
  z-index: 100;
`;

const Arrow = styled("div")`
  position: absolute;
  width: 10px;
  height: 5px;
  margin-top: -10px;

  &::before {
    content: "";
    display: block;
    border: 5px solid transparent;
  }

  &[data-placement*="bottom"] {
    &::before {
      border-bottom-color: #fff;
    }
  }

  &[data-placement*="top"] {
    bottom: -5px;
    &::before {
      border-top-color: #fff;
    }
  }
`;

const Selections = styled("div")`
  padding: 4px 0;
  margin-top: -2px;
  background: #fff;
  border-radius: 3px;
  overflow: scroll;
  max-height: 210px;
  min-width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const AnimatedContainer = styled(motion.div)``;

AnimatedContainer.defaultProps = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 },
  transition: {
    opacity: { duration: 0.15 },
    y: { duration: 0.3 },
    scale: { duration: 0.3 },
  },
};

const ItemButton = styled("button")<{ isActive: boolean }>`
  font-family: "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI";
  font-size: 0.85rem;
  text-align: left;
  padding: 2px 8px;
  display: block;
  width: 100%;
  background: none;
  border: none;
  outline: none;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }

  &:focus {
    outline: none;
    background: #eee;
  }

  ${(p) =>
    p.isActive
      ? `
    background-color: #6C5FC7;
    color: #fff;
  `
      : `
    &:hover,
    &.active {
      background-color: #FAF9FB;
    }
  `}
`;

function CodeWrapper(props): JSX.Element {
  let { children, class: className, ...rest } = props;
  if (children) {
    children = makeKeywordsClickable(children);
  }
  return (
    <code className={className} {...rest}>
      {children}
    </code>
  );
}

function SpanWrapper(props): JSX.Element {
  let { children, class: className, ...rest } = props;
  if (children) {
    children = makeKeywordsClickable(children);
  }
  return (
    <span className={className} {...rest}>
      {children}
    </span>
  );
}

type Props = {
  filename?: string;
  language?: string;
  title?: string;
  children: JSX.Element;
};

export default ({ filename, language, children }: Props): JSX.Element => {
  const [showCopied, setShowCopied] = useState(false);
  const codeRef = useRef(null);

  function copyCode() {
    let code = codeRef.current.innerText;
    // don't copy leading prompt for bash
    if (language === "bash" || language === "shell") {
      const match = code.match(/^\$\s*/);
      if (match) {
        code = code.substr(match[0].length);
      }
    }
    copy(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1200);
  }

  return (
    <div className="code-block">
      <div className="code-actions">
        <code className="filename">{filename}</code>
        <button className="copy" onClick={() => copyCode()}>
          <Clipboard size={16} />
        </button>
      </div>
      <div className="copied" style={{ opacity: showCopied ? 1 : 0 }}>
        Copied
      </div>
      <div ref={codeRef}>
        <MDXProvider
          components={{
            code: CodeWrapper,
            span: SpanWrapper,
          }}
        >
          {children}
        </MDXProvider>
      </div>
    </div>
  );
};
