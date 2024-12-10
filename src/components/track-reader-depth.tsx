'use client';
import {useEffect} from 'react';
import {usePlausible} from 'next-plausible';

import {debounce} from 'sentry-docs/utils';

const EVENT = 'Read Progress';
const milestones = [25, 50, 75, 100] as const;
type Milestone = (typeof milestones)[number];
type EVENT_PROPS = {page: string; readProgress: Milestone};

export function ReaderDepthTracker() {
  const plausible = usePlausible<{[EVENT]: EVENT_PROPS}>();

  const sendProgressToPlausible = (progress: Milestone) => {
    // TODO: remove this after PR review
    const args = [
      EVENT,
      {props: {readProgress: progress, page: document.title}},
    ] as const;
    plausible(...args);
    console.log('plausible event', ...args);
  };

  useEffect(() => {
    const reachedMilestones = new Set<Milestone>();

    const trackProgress = () => {
      // calculate the progress based on the scroll position
      const scrollPosition = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.floor((scrollPosition / totalHeight) * 100);

      // find the biggest milestone that has not been reached yet
      const milestone = milestones.findLast(
        m =>
          progress >= m &&
          !reachedMilestones.has(m) &&
          // we shouldn't report smaller milestones once a bigger one has been reached
          Array.from(reachedMilestones).every(r => m > r)
      );
      if (milestone) {
        reachedMilestones.add(milestone);
        sendProgressToPlausible(milestone);
      }
    };

    // if the totalHeight is zero, we can't calculate the progress, the user is alredy at 100%
    // the early return prevents division by zero in the trackProgress function
    if (document.documentElement.scrollHeight - window.innerHeight === 0) {
      sendProgressToPlausible(100);
      return () => {};
    }
    const debouncedTrackProgress = debounce(trackProgress, 50);

    window.addEventListener('scrollend', debouncedTrackProgress);
    return () => {
      window.removeEventListener('scrollend', debouncedTrackProgress);
    };
  });
  // do not render anything
  return null;
}
