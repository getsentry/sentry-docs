'use client';

import {ArrowDown} from 'react-feather';
import styled from '@emotion/styled';
import {motion} from 'framer-motion';

export const PositionWrapper = styled('div')`
  z-index: 100;
`;

export const Arrow = styled('div')`
  position: absolute;
  width: 10px;
  height: 5px;
  margin-top: -10px;

  &::before {
    content: '';
    display: block;
    border: 5px solid transparent;
  }

  &[data-placement*='bottom'] {
    &::before {
      border-bottom-color: #fff;
    }
  }

  &[data-placement*='top'] {
    bottom: -5px;
    &::before {
      border-top-color: #fff;
    }
  }
`;

export const Dropdown = styled('div')<{dark: boolean}>`
  font-family:
    'Rubik',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI';
  overflow: hidden;
  border-radius: 3px;
  background: ${p => (p.dark ? 'var(--gray-4)' : '#fff')};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const Selections = styled('div')`
  overflow: scroll;
  overscroll-behavior: contain;
  max-height: 210px;
  min-width: 300px;
`;

export const DropdownHeader = styled('div')`
  font-family:
    'Rubik',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI';
  padding: 6px 8px;
  font-size: 0.875rem;
  color: #80708f;
  border-bottom: 1px solid #dbd6e1;
`;

export const ItemButton = styled('button')<{dark: boolean; isActive: boolean}>`
  font-family:
    'Rubik',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI';
  font-size: 0.85rem;
  text-align: left;
  padding: 6px 8px;
  cursor: pointer;
  display: block;
  width: 100%;
  background: none;
  border: none;
  outline: none;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }

  ${p =>
    p.isActive
      ? `
    background-color: #6C5FC7;
    color: #EBE6EF;
    `
      : `
    
    
    &:focus {
      outline: none;
      background-color: ${p.dark ? 'var(--gray-a4)' : 'var(--accent-purple-light)'};
    }
    &:hover,
    &.active {
      background-color: ${p.dark ? 'var(--gray-a4)' : 'var(--accent-purple-light)'};
    }
  `}
`;

export const KeywordDropdown = styled('span')`
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

export const KeywordIndicator = styled(ArrowDown, {
  shouldForwardProp: p => p !== 'isOpen',
})<{
  isOpen: boolean;
}>`
  user-select: none;
  margin-right: 2px;
  transition: transform 200ms ease-in-out;
  transform: rotate(${p => (p.isOpen ? '180deg' : '0')});
  stroke-width: 3px;
  position: relative;
  top: -1px;
`;

export const KeywordSpan = styled(motion.span)`
  grid-row: 1;
  grid-column: 1;
`;

export const KeywordSearchInput = styled('input')<{dark: boolean}>`
  border-width: 1.5px;
  border-style: solid;
  border-color: ${p => (p.dark ? '' : 'var(--desatPurple12)')};
  border-radius: 0.25rem;
  width: 280px;
  -webkit-appearance: none;
  appearance: none;
  padding: 0.25rem 0.75rem;
  line-height: 1.8;
  border-radius: 0.25rem;
  outline: none;
  margin: 10px;

  &:focus {
    border-color: var(--accent-purple);
    box-shadow: 0 0 0 0.2rem
      ${p => (p.dark ? 'var(--gray-a4)' : 'var(--accent-purple-light)')};
  }
`;
