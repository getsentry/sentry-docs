import React, { useState, useRef, useContext } from "react";
import copy from "copy-to-clipboard";
import { MDXProvider } from "@mdx-js/react";
import { Clipboard } from "react-feather";
import { useOnClickOutside, useRefWithCallback } from "../utils";
import CodeContext from "./codeContext";

const KEYWORDS_REGEX = /\b___(?:([A-Z_][A-Z0-9_]*)\.)?([A-Z_][A-Z0-9_]*)___\b/g;

function makeKeywordsClickable(children) {
  if (!Array.isArray(children)) {
    children = [children];
  }

  KEYWORDS_REGEX.lastIndex = 0;

  return children.reduce((arr: any[], child) => {
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
        Selector({
          group: match[1] || "PROJECT",
          keyword: match[2],
          key: lastIndex,
        })
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

function Selector({ keyword, group, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const codeContext = useContext(CodeContext);
  const [
    sharedSelection,
    setSharedSelection,
  ] = codeContext.sharedKeywordSelection;
  const spanRef = useRef<HTMLSpanElement>();
  const [menuRef, setMenuRef] = useRefWithCallback<HTMLSpanElement>(
    menuNode => {
      if (menuNode) {
        for (const node of menuNode.childNodes as any) {
          if (node.getAttribute("data-active") === "1") {
            node.parentNode.scrollTop =
              node.offsetTop -
              node.parentNode.getBoundingClientRect().height / 2 +
              node.getBoundingClientRect().height / 2;
            break;
          }
        }
      }
    }
  );

  useOnClickOutside(menuRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const { codeKeywords } = useContext(CodeContext);
  const choices = (codeKeywords && codeKeywords[group]) || [];
  const currentSelectionIdx = sharedSelection[group] || 0;
  const currentSelection = choices[currentSelectionIdx];

  if (!currentSelection) {
    return keyword;
  }

  // this is not super clean but since we can depend on the span
  // rendering before the menu this works.
  const style: {
    [key: string]: any;
  } = {};
  if (spanRef.current) {
    const rect = spanRef.current.getBoundingClientRect();
    style.left = spanRef.current.offsetLeft - 10 + "px";
    style.top = spanRef.current.offsetTop + 20 + "px";
    style.minWidth = rect.width + 20 + "px";
  }

  return (
    <span className="keyword-selector-wrapper" {...props}>
      <span
        ref={spanRef}
        role="button"
        tabIndex={0}
        className={`keyword-selector ${isOpen ? " open" : ""}`}
        title={currentSelection && currentSelection.title}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        onKeyDown={e => {
          if (e.key === "Enter") {
            setIsOpen(!isOpen);
          }
        }}
      >
        {currentSelection[keyword]}
      </span>
      {isOpen && (
        <div style={style} className="selections" ref={setMenuRef}>
          {choices.map((item, idx) => {
            const isActive = idx === currentSelectionIdx;
            return (
              <button
                key={idx}
                data-active={isActive ? "1" : ""}
                onClick={() => {
                  const newSharedSelection = { ...sharedSelection };
                  newSharedSelection[group] = idx;
                  setSharedSelection(newSharedSelection);
                  setIsOpen(false);
                }}
                className={isActive ? "active" : ""}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}

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
