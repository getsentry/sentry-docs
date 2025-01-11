'use client';

import {motion, MotionProps} from 'framer-motion';

export function AnimatedContainer({
  initial = {opacity: 0, y: 5},
  animate = {opacity: 1, y: 0},
  exit = {opacity: 0, scale: 0.95},
  transition = {
    opacity: {duration: 0.15},
    y: {duration: 0.3},
    scale: {duration: 0.3},
  },
  ...props
}: MotionProps) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    />
  );
}
