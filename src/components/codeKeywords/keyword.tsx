'use client';

import {MotionProps} from 'framer-motion';

import {KeywordSpan} from './styles';

export function Keyword({
  initial = {opacity: 1, y: 0, position: 'relative'},
  animate = {
    position: 'relative',
    opacity: 1,
    y: 0,
  },
  exit = {opacity: 0, y: 20},
  transition = {
    opacity: {duration: 0.15},
    y: {duration: 0.25},
  },
  showPreview: hasPreview = false,
  ...props
}: MotionProps & {showPreview?: boolean}) {
  return (
    <KeywordSpan
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      hasPreview={hasPreview}
      {...props}
    />
  );
}
