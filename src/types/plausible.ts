export const PROGRESS_MILESTONES = [25, 50, 75, 100] as const;
export type ReadProgressMilestone = (typeof PROGRESS_MILESTONES)[number];
