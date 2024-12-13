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
    plausible(EVENT, {props: {readProgress: progress, page: document.title}});
  };

  useEffect(() => {
    const reachedMilestones = new Set<Milestone>();

    const trackProgress = () => {
      // calculate the progress based on the scroll position
      const scrollPosition = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      let progress = Math.floor((scrollPosition / totalHeight) * 100);
      // it's hard to trigger the 100% milestone, so we'll just assume beyond 95%
      if (progress > 95) {
        progress = 100;
      }

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

    // if the page is not scrollable, we don't need to track anything
    if (document.documentElement.scrollHeight - window.innerHeight === 0) {
      return () => {};
    }
    const debouncedTrackProgress = debounce(trackProgress, 50);

    window.addEventListener('scroll', debouncedTrackProgress);
    return () => {
      window.removeEventListener('scroll', debouncedTrackProgress);
    };
  });
  // do not render anything
  return null;
}
