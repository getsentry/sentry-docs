'use client';

import {ComponentProps, Fragment, useContext, useState} from 'react';
import {createPortal} from 'react-dom';
import {usePopper} from 'react-popper';
import {AnimatePresence} from 'framer-motion';
import {useTheme} from 'next-themes';

import {useOnClickOutside} from 'sentry-docs/clientUtils';
import {useIsMounted} from 'sentry-docs/hooks/isMounted';

import {CodeContext} from '../codeContext';

import {AnimatedContainer} from './animatedContainer';
import {Keyword} from './keyword';
import {
  Arrow,
  Dropdown,
  ItemButton,
  KeywordDropdown,
  KeywordIndicator,
  KeywordSearchInput,
  PositionWrapper,
  ProjectPreview,
  Selections,
} from './styles';
import {dropdownPopperOptions} from './utils';

type KeywordSelectorProps = {
  group: string;
  index: number;
  keyword: string;
  showPreview: boolean;
};

export function KeywordSelector({
  keyword,
  group,
  index,
  showPreview,
}: KeywordSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [referenceEl, setReferenceEl] = useState<HTMLSpanElement | null>(null);
  const [dropdownEl, setDropdownEl] = useState<HTMLElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [orgFilter, setOrgFilter] = useState('');
  const [showProjectPreview, setShowProjectPreview] = useState(false);
  const {resolvedTheme: theme} = useTheme();

  const isDarkMode = theme === 'dark';
  const {isMounted} = useIsMounted();

  const {styles, state, attributes} = usePopper(
    referenceEl,
    dropdownEl,
    dropdownPopperOptions
  );

  useOnClickOutside({
    ref: {current: referenceEl},
    enabled: isOpen,
    handler: () => setIsOpen(false),
  });

  const codeContext = useContext(CodeContext);
  if (!codeContext) {
    return null;
  }

  const [sharedSelection, setSharedSelection] = codeContext.sharedKeywordSelection;

  const {codeKeywords} = codeContext;
  const choices = codeKeywords?.[group] ?? [];
  const currentSelectionIdx = sharedSelection[group] ?? 0;
  const currentSelection = choices[currentSelectionIdx];

  if (!currentSelection) {
    return <Fragment>keyword</Fragment>;
  }

  const selector = isOpen && (
    <PositionWrapper style={styles.popper} ref={setDropdownEl} {...attributes.popper}>
      <AnimatedContainer>
        <Dropdown dark={isDarkMode}>
          <Arrow
            style={styles.arrow}
            data-placement={state?.placement}
            data-popper-arrow
          />
          {choices.length > 5 && (
            <KeywordSearchInput
              placeholder="Search Project"
              onClick={e => e.stopPropagation()}
              value={orgFilter}
              onChange={e => setOrgFilter(e.target.value)}
              dark={isDarkMode}
            />
          )}
          <Selections>
            {choices
              .filter(({title}) => {
                return title.includes(orgFilter);
              })
              .map(item => {
                const idx = choices.findIndex(({title}) => title === item.title);
                const isActive = idx === currentSelectionIdx;
                return (
                  <ItemButton
                    data-sentry-mask
                    key={item.title}
                    isActive={isActive}
                    onClick={() => {
                      const newSharedSelection = {...sharedSelection};
                      newSharedSelection[group] = idx;
                      setSharedSelection(newSharedSelection);
                      setIsOpen(false);
                    }}
                    dark={isDarkMode}
                  >
                    {item.title}
                  </ItemButton>
                );
              })}
          </Selections>
        </Dropdown>
      </AnimatedContainer>
    </PositionWrapper>
  );

  return (
    <Fragment>
      <KeywordDropdown
        key={index}
        ref={setReferenceEl}
        role="button"
        tabIndex={0}
        title={currentSelection?.title}
        aria-label={
          currentSelection?.title
            ? `${currentSelection?.title}: ${currentSelection[keyword]}. Click to select different project.`
            : `Click to select project`
        }
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={e => e.key === 'Enter' && setIsOpen(!isOpen)}
        onMouseEnter={() => setShowProjectPreview(true)}
        onMouseLeave={() => setShowProjectPreview(false)}
        onFocus={() => setShowProjectPreview(true)}
        onBlur={() => setShowProjectPreview(false)}
      >
        <KeywordIndicatorComponent isOpen={isOpen} />
        <span
          style={{
            // We set inline-grid only when animating the keyword so they
            // correctly overlap during animations, but this must be removed
            // after so copy-paste correctly works.
            display: isAnimating ? 'inline-grid' : undefined,
            position: 'relative',
          }}
        >
          <AnimatePresence initial={false}>
            <Keyword
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}
              key={currentSelectionIdx}
              showPreview={showPreview}
            >
              {currentSelection[keyword]}
            </Keyword>
          </AnimatePresence>
          {!isOpen && showProjectPreview && showPreview && currentSelection?.title && (
            <ProjectPreview className="no-copy" aria-hidden="true">
              {currentSelection.title}
            </ProjectPreview>
          )}
        </span>
      </KeywordDropdown>
      {isMounted &&
        createPortal(<AnimatePresence>{selector}</AnimatePresence>, document.body)}
    </Fragment>
  );
}

function KeywordIndicatorComponent({
  isOpen,
  size = '12px',
  ...props
}: ComponentProps<typeof KeywordIndicator>) {
  return <KeywordIndicator isOpen={isOpen} size={size} {...props} />;
}
