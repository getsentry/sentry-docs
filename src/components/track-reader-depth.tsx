'use client';
import {useEffect} from 'react';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {PROGRESS_MILESTONES, ReadProgressMilestone} from 'sentry-docs/types/plausible';
import {debounce} from 'sentry-docs/utils';

export function ReaderDepthTracker() {
  const {emit} = usePlausibleEvent();

  const sendProgressToPlausible = (progress: ReadProgressMilestone) => {
    emit('Read Progress', {props: {readProgress: progress, page: document.title}});
  };

  useEffect(() => {
    const reachedMilestones = new Set<ReadProgressMilestone>();

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
      const milestone = PROGRESS_MILESTONES.findLast(
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
