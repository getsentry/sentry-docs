import * as v from 'valibot';

const shortText = () => v.pipe(v.string(), v.maxLength(500));
const evidenceText = () => v.pipe(v.string(), v.maxLength(1_000));

export const ClassificationSchema = v.picklist([
  'sdk-docs',
  'product-docs',
  'developer-docs',
  'platform-bug',
  'platform-improvement',
  'broken-link',
  'duplicate',
  'support-question',
]);

export const PrioritySchema = v.picklist(['urgent', 'high', 'medium', 'low', 'none']);
export const EffortSchema = v.picklist(['small', 'medium', 'large']);

export const LinearTeamSchema = v.picklist([
  'docs',
  'javascript-sdks',
  'web-backend-sdks',
  'mobile-platform',
  'native-platform',
  'ecosystem',
]);

export const TeamSchema = v.picklist([
  'Team: Docs',
  'Team: JavaScript SDKs',
  'Team: Web Backend SDKs',
  'Team: Mobile Platform',
  'Team: Native Platform',
  'Team: Replay',
  'Team: Crons',
  'Team: Ecosystem',
]);

const LINEAR_TEAM_LABELS: Record<
  v.InferOutput<typeof LinearTeamSchema>,
  v.InferOutput<typeof TeamSchema>
> = {
  docs: 'Team: Docs',
  'javascript-sdks': 'Team: JavaScript SDKs',
  'web-backend-sdks': 'Team: Web Backend SDKs',
  'mobile-platform': 'Team: Mobile Platform',
  'native-platform': 'Team: Native Platform',
  ecosystem: 'Team: Ecosystem',
};

export function githubLabelForLinearTeam(
  team: v.InferOutput<typeof LinearTeamSchema>
): v.InferOutput<typeof TeamSchema> {
  return LINEAR_TEAM_LABELS[team];
}

export const PlatformSchema = v.picklist([
  'Platform: .NET',
  'Platform: Android',
  'Platform: CLI',
  'Platform: Cocoa',
  'Platform: Dart',
  'Platform: Elixir',
  'Platform: Flutter',
  'Platform: Go',
  'Platform: Java',
  'Platform: JavaScript',
  'Platform: KMP',
  'Platform: Native',
  'Platform: PHP',
  'Platform: Python',
  'Platform: React-Native',
  'Platform: Ruby',
  'Platform: Rust',
  'Platform: Unity',
  'Platform: Unreal',
]);

export const ProductAreaSchema = v.picklist([
  'Product Area: Issues',
  'Product Area: Performance',
  'Product Area: Profiling',
  'Product Area: DDM',
  'Product Area: Replays',
  'Product Area: Crons',
  'Product Area: Alerts',
  'Product Area: Discover',
  'Product Area: Dashboards',
  'Product Area: Releases',
  'Product Area: User Feedback',
  'Product Area: Stats',
  'Product Area: Settings',
  'Product Area: SDKs - Web Frontend',
  'Product Area: SDKs - Web Backend',
  'Product Area: SDKs - Mobile',
  'Product Area: SDKs - Native',
  'Product Area: APIs',
  'Product Area: Docs',
  'Product Area: Other',
]);

const TriageDecisionObjectSchema = v.object({
  classification: ClassificationSchema,
  actionability: v.picklist(['actionable', 'needs-information']),
  platform: v.optional(PlatformSchema),
  productArea: v.optional(ProductAreaSchema),
  team: TeamSchema,
  contentOwner: v.picklist(['docs', 'sdk-team']),
  targetLinearTeam: LinearTeamSchema,
  routingConfidence: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
  routingEvidence: v.pipe(v.array(evidenceText()), v.maxLength(5)),
  priority: PrioritySchema,
  effort: EffortSchema,
  linearLabel: v.picklist(['Docs Content', 'Docs Platform']),
  confidence: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
  summary: shortText(),
  evidence: v.pipe(v.array(evidenceText()), v.maxLength(5)),
  relatedFiles: v.pipe(v.array(shortText()), v.maxLength(5)),
  missingInformation: v.pipe(v.array(shortText()), v.maxLength(5)),
  automationFlow: v.picklist([
    'none',
    'broken-link-fix',
    'needs-information',
    'duplicate',
    'already-resolved',
  ]),
  recommendedAction: v.picklist([
    'route',
    'request-information',
    'candidate-quick-fix',
    'close-as-duplicate',
    'close-as-resolved',
    'human-review',
  ]),
  potentialDuplicate: v.optional(
    v.object({
      issueNumber: v.pipe(v.number(), v.integer(), v.minValue(1)),
      reason: shortText(),
    })
  ),
  quickFix: v.optional(
    v.object({
      kind: v.picklist(['content-edit', 'redirect']),
      description: shortText(),
      brokenUrl: shortText(),
      replacementUrl: shortText(),
      targetFiles: v.pipe(v.array(shortText()), v.maxLength(5)),
    })
  ),
  parkingLotReason: v.optional(
    v.picklist([
      'low-impact',
      'high-effort-relative-to-impact',
      'unsupported-or-obsolete',
      'out-of-scope',
      'superseded',
      'other-requires-review',
    ])
  ),
});

function isConsistentDecision(
  decision: v.InferOutput<typeof TriageDecisionObjectSchema>
): boolean {
  const expectsPlatformLabel = [
    'platform-bug',
    'platform-improvement',
    'broken-link',
  ].includes(decision.classification);
  if (
    decision.linearLabel !== (expectsPlatformLabel ? 'Docs Platform' : 'Docs Content')
  ) {
    return false;
  }
  if ((decision.contentOwner === 'docs') !== (decision.targetLinearTeam === 'docs')) {
    return false;
  }
  if (decision.team !== githubLabelForLinearTeam(decision.targetLinearTeam)) {
    return false;
  }
  if (
    (decision.priority === 'none' &&
      decision.actionability === 'actionable' &&
      decision.automationFlow === 'none' &&
      decision.parkingLotReason === undefined) ||
    (decision.priority !== 'none' && decision.parkingLotReason !== undefined) ||
    (decision.actionability === 'needs-information' &&
      decision.parkingLotReason !== undefined)
  ) {
    return false;
  }
  if (
    decision.automationFlow !== 'needs-information' &&
    decision.missingInformation.length > 0
  ) {
    return false;
  }
  if (decision.automationFlow !== 'broken-link-fix' && decision.quickFix) {
    return false;
  }
  if (decision.automationFlow === 'needs-information') {
    return (
      decision.actionability === 'needs-information' &&
      decision.recommendedAction === 'request-information' &&
      decision.missingInformation.length > 0
    );
  }
  if (decision.actionability !== 'actionable' || decision.missingInformation.length > 0) {
    return false;
  }
  if (decision.automationFlow === 'broken-link-fix') {
    return (
      decision.classification === 'broken-link' &&
      decision.priority !== 'none' &&
      decision.recommendedAction === 'candidate-quick-fix' &&
      decision.quickFix !== undefined &&
      decision.missingInformation.length === 0
    );
  }
  if (decision.automationFlow === 'duplicate') {
    return (
      decision.classification === 'duplicate' &&
      decision.recommendedAction === 'close-as-duplicate' &&
      decision.potentialDuplicate !== undefined
    );
  }
  if (decision.automationFlow === 'already-resolved') {
    return decision.recommendedAction === 'close-as-resolved';
  }
  return ![
    'request-information',
    'candidate-quick-fix',
    'close-as-duplicate',
    'close-as-resolved',
  ].includes(decision.recommendedAction);
}

export const TriageDecisionSchema = v.pipe(
  TriageDecisionObjectSchema,
  v.check(
    isConsistentDecision,
    'The classification, Linear label, automated flow, evidence, and action are inconsistent.'
  )
);

export const GitHubCommentSchema = v.object({
  author: v.string(),
  authorType: v.string(),
  body: v.string(),
  createdAt: v.string(),
  url: v.string(),
});

export const LinkedPullRequestSchema = v.object({
  repository: v.string(),
  number: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
  state: v.picklist(['open', 'closed']),
  merged: v.boolean(),
  relationship: v.picklist(['closing', 'reference']),
  updatedAt: v.string(),
  url: v.string(),
});

export const LinearLinkbackSchema = v.object({
  identifier: v.pipe(v.string(), v.regex(/^DOCS-\d+$/)),
  url: v.string(),
});

export const GitHubIssueContextSchema = v.object({
  repository: v.literal('getsentry/sentry-docs'),
  number: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
  body: v.string(),
  labels: v.array(v.string()),
  template: v.string(),
  formFields: v.record(v.string(), v.string()),
  author: v.object({
    login: v.string(),
    association: v.string(),
    type: v.string(),
  }),
  state: v.picklist(['open', 'closed']),
  createdAt: v.string(),
  updatedAt: v.string(),
  lastQualifyingGitHubActivityAt: v.string(),
  lastQualifyingLinearActivityAt: v.optional(v.string()),
  url: v.string(),
  comments: v.array(GitHubCommentSchema),
  linkedPullRequests: v.array(LinkedPullRequestSchema),
  linearLinkback: v.optional(LinearLinkbackSchema),
  linear: v.optional(
    v.object({
      id: v.string(),
      identifier: v.string(),
      teamId: v.string(),
      teamKey: v.string(),
      teamName: v.string(),
      stateId: v.string(),
      stateName: v.string(),
      stateType: v.string(),
      priority: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(4)),
      assigneeId: v.optional(v.string()),
      lastHumanActivityAt: v.optional(v.string()),
    })
  ),
});

export const EmployeeOverridesSchema = v.object({
  employees: v.array(v.string()),
  nonEmployees: v.array(v.string()),
});

export type TriageDecision = v.InferOutput<typeof TriageDecisionSchema>;
export type GitHubIssueContext = v.InferOutput<typeof GitHubIssueContextSchema>;
export type EmployeeOverrides = v.InferOutput<typeof EmployeeOverridesSchema>;

export interface PolicyProjection {
  isEmployee: boolean;
  employeeSource:
    | 'association'
    | 'linear-sync'
    | 'override'
    | 'non-employee-override'
    | 'none';
  resolutionAutomationCandidate: boolean;
  employeeProtectionsDeferred: boolean;
  effectivePriority: TriageDecision['priority'];
  employeeFallbackPriority?: TriageDecision['priority'];
  employeeFallbackOwnerDueAt?: string;
  employeeFallbackHighPriorityReviewDueAt?: string;
  targetLinearTeam: v.InferOutput<typeof LinearTeamSchema>;
  githubTeamLabel: v.InferOutput<typeof TeamSchema>;
  routingSource: 'issue-form' | 'model' | 'docs-fallback';
  individualOwnerRequired: boolean;
  individualOwnerDueAt?: string;
  highPriorityReviewDueAt?: string;
  needsInformationCloseDueAt?: string;
  needsInformationResponseWindowDays?: 14;
  parkingLotEligibleAt?: string;
  parkingLotInactivityMonths: 3;
  parkingLotReview: 'none' | 'immediate-priority-none' | 'inactive-three-months';
  parkingLotGitHubLabel: 'Parking Lot';
  parkingLotLinearStatus: 'Canceled';
  parkingLotLinearStatusType: 'canceled';
  closurePolicy:
    | 'human-only'
    | 'after-validated-resolution'
    | 'after-needs-information-timeout'
    | 'parking-lot-review';
  nextActions: string[];
}

interface SdkRoute {
  linearTeam: v.InferOutput<typeof LinearTeamSchema>;
  githubTeamLabel: v.InferOutput<typeof TeamSchema>;
}

const SDK_ROUTES: Record<string, SdkRoute> = {
  'Android SDK': {
    linearTeam: 'mobile-platform',
    githubTeamLabel: 'Team: Mobile Platform',
  },
  'Apple SDK': {linearTeam: 'mobile-platform', githubTeamLabel: 'Team: Mobile Platform'},
  'Dart SDK': {linearTeam: 'mobile-platform', githubTeamLabel: 'Team: Mobile Platform'},
  'Elixir SDK': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'Flutter SDK': {
    linearTeam: 'mobile-platform',
    githubTeamLabel: 'Team: Mobile Platform',
  },
  'Go SDK': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'Java SDK': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'JavaScript SDK': {
    linearTeam: 'javascript-sdks',
    githubTeamLabel: 'Team: JavaScript SDKs',
  },
  'Kotlin Multiplatform SDK': {
    linearTeam: 'mobile-platform',
    githubTeamLabel: 'Team: Mobile Platform',
  },
  'Native SDK': {linearTeam: 'native-platform', githubTeamLabel: 'Team: Native Platform'},
  '.NET SDK': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'PHP SDK': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'PowerShell SDK': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'Python SDK': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'React Native SDK': {
    linearTeam: 'mobile-platform',
    githubTeamLabel: 'Team: Mobile Platform',
  },
  'Ruby SDK': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'Rust SDK': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'Unity SDK': {linearTeam: 'native-platform', githubTeamLabel: 'Team: Native Platform'},
  'Unreal Engine SDK': {
    linearTeam: 'native-platform',
    githubTeamLabel: 'Team: Native Platform',
  },
  'Sentry CLI': {linearTeam: 'ecosystem', githubTeamLabel: 'Team: Ecosystem'},
  'All JavaScript SDKs': {
    linearTeam: 'javascript-sdks',
    githubTeamLabel: 'Team: JavaScript SDKs',
  },
  'All Backend SDKs': {
    linearTeam: 'web-backend-sdks',
    githubTeamLabel: 'Team: Web Backend SDKs',
  },
  'All Mobile SDKs': {
    linearTeam: 'mobile-platform',
    githubTeamLabel: 'Team: Mobile Platform',
  },
  'All Gaming SDKs': {
    linearTeam: 'native-platform',
    githubTeamLabel: 'Team: Native Platform',
  },
};

export function sdkRouteFromIssue(issue: GitHubIssueContext): SdkRoute | undefined {
  return SDK_ROUTES[issue.formFields.SDK];
}

export interface ShadowTriageResult {
  schemaVersion: 2;
  mode: 'shadow';
  generatedAt: string;
  issue: GitHubIssueContext;
  decision: TriageDecision;
  policy: PolicyProjection;
  warnings: string[];
  model?: unknown;
  usage?: unknown;
}

export function parseIssueForm(body: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const headings = /^### (.+?)\s*\n+([\s\S]*?)(?=^### |(?![\s\S]))/gm;

  for (const match of body.matchAll(headings)) {
    const value = match[2].trim();
    if (value && value !== '_No response_') {
      fields[match[1].trim()] = value;
    }
  }

  return fields;
}

export function inferTemplate(labels: string[]): string {
  const set = new Set(labels);
  if (set.has('Docs') && set.has('SDKs')) return 'sdk-docs';
  if (set.has('Docs') && set.has('Product')) return 'product-docs';
  if (set.has('Docs') && set.has('Develop')) return 'developer-docs';
  if (set.has('Docs Platform') && set.has('404')) return 'broken-link';
  if (set.has('Docs Platform') && set.has('Improvement')) {
    return 'platform-improvement';
  }
  if (set.has('Docs Platform') && set.has('Bug')) return 'platform-bug';
  return 'unknown';
}

export function parseLinearLinkback(
  comments: Array<{author: string; body: string}>
): v.InferOutput<typeof LinearLinkbackSchema> | undefined {
  for (const comment of comments.toReversed()) {
    if (!['linear-code', 'linear-code[bot]'].includes(comment.author)) continue;
    const match = comment.body.match(
      /https:\/\/linear\.app\/getsentry\/issue\/(DOCS-\d+)(?:\/[^\s"<)]*)?/i
    );
    if (match) {
      return {
        identifier: match[1].toUpperCase(),
        url: match[0],
      };
    }
  }
  return undefined;
}

export function identifyEmployee(
  login: string,
  association: string,
  overrides: EmployeeOverrides
): Pick<PolicyProjection, 'isEmployee' | 'employeeSource'> {
  const normalized = login.toLowerCase();
  if (overrides.nonEmployees.some(value => value.toLowerCase() === normalized)) {
    return {isEmployee: false, employeeSource: 'non-employee-override'};
  }
  if (overrides.employees.some(value => value.toLowerCase() === normalized)) {
    return {isEmployee: true, employeeSource: 'override'};
  }
  if (normalized === 'linear-code' || normalized === 'linear-code[bot]') {
    return {isEmployee: true, employeeSource: 'linear-sync'};
  }
  if (association === 'OWNER' || association === 'MEMBER') {
    return {isEmployee: true, employeeSource: 'association'};
  }
  return {isEmployee: false, employeeSource: 'none'};
}

function addDays(value: string, days: number): string {
  const date = new Date(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

function addMonths(value: string, months: number): string {
  const date = new Date(value);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  ).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString();
}

function minimumHigh(priority: TriageDecision['priority']): TriageDecision['priority'] {
  return priority === 'urgent' ? 'urgent' : 'high';
}

export function priorityFromLinear(
  value: number | undefined
): TriageDecision['priority'] | undefined {
  return ({0: 'none', 1: 'urgent', 2: 'high', 3: 'medium', 4: 'low'} as const)[
    value ?? -1
  ];
}

export function projectPolicy(
  issue: GitHubIssueContext,
  decision: TriageDecision,
  overrides: EmployeeOverrides
): PolicyProjection {
  const employee = identifyEmployee(
    issue.author.login,
    issue.author.association,
    overrides
  );
  const resolutionAutomationCandidate =
    (decision.actionability === 'actionable' &&
      decision.automationFlow === 'broken-link-fix' &&
      decision.confidence >= 0.9 &&
      decision.quickFix !== undefined) ||
    (decision.automationFlow === 'already-resolved' &&
      issue.linkedPullRequests.some(
        pull => pull.merged && pull.relationship === 'closing'
      )) ||
    (decision.automationFlow === 'duplicate' &&
      decision.confidence >= 0.95 &&
      decision.potentialDuplicate !== undefined);
  const employeeProtectionsDeferred = false;
  const currentPriority = priorityFromLinear(issue.linear?.priority);
  const effectivePriority = employee.isEmployee
    ? minimumHigh(decision.priority)
    : decision.actionability === 'needs-information'
      ? currentPriority === 'urgent' || currentPriority === 'high'
        ? currentPriority
        : 'none'
      : decision.priority;
  const deterministicRoute =
    decision.contentOwner === 'sdk-team' ? sdkRouteFromIssue(issue) : undefined;
  const modelRouteIsConfident =
    decision.contentOwner === 'sdk-team' && decision.routingConfidence >= 0.85;
  const targetLinearTeam =
    deterministicRoute?.linearTeam ??
    (modelRouteIsConfident ? decision.targetLinearTeam : 'docs');
  const githubTeamLabel = githubLabelForLinearTeam(targetLinearTeam);
  const routingSource = deterministicRoute
    ? 'issue-form'
    : modelRouteIsConfident
      ? 'model'
      : 'docs-fallback';
  const hasCompleteActivity = Boolean(issue.lastQualifyingLinearActivityAt);
  const lastActivityAt = hasCompleteActivity
    ? [issue.lastQualifyingGitHubActivityAt, issue.lastQualifyingLinearActivityAt!]
        .sort()
        .at(-1)!
    : undefined;
  const immediateParkingReview =
    !employee.isEmployee &&
    decision.actionability === 'actionable' &&
    effectivePriority === 'none' &&
    !resolutionAutomationCandidate;
  const inactiveParkingReview =
    !employee.isEmployee &&
    decision.actionability === 'actionable' &&
    (effectivePriority === 'medium' || effectivePriority === 'low') &&
    lastActivityAt !== undefined;
  const parkingLotReview = immediateParkingReview
    ? 'immediate-priority-none'
    : inactiveParkingReview
      ? 'inactive-three-months'
      : 'none';
  const individualOwnerRequired =
    (effectivePriority === 'high' || effectivePriority === 'urgent') &&
    !issue.linear?.assigneeId;
  const nextActions: string[] = [];

  if (resolutionAutomationCandidate) {
    nextActions.push(
      'Validate the recommended resolution flow before allowing closure; apply the explicit employee fallback if validation fails.'
    );
  } else {
    nextActions.push(`Route to ${targetLinearTeam} at ${effectivePriority} priority.`);
  }

  if (individualOwnerRequired) {
    nextActions.push(
      'Require an individual Linear assignee within seven days of triage.'
    );
  }
  if (decision.automationFlow === 'needs-information') {
    nextActions.push(
      'Request the structured missing information and re-triage on reply.'
    );
  }

  return {
    ...employee,
    resolutionAutomationCandidate,
    employeeProtectionsDeferred,
    effectivePriority,
    employeeFallbackPriority: employee.isEmployee
      ? minimumHigh(decision.priority)
      : undefined,
    employeeFallbackOwnerDueAt: employee.isEmployee
      ? addDays(issue.createdAt, 7)
      : undefined,
    employeeFallbackHighPriorityReviewDueAt: employee.isEmployee
      ? addDays(issue.createdAt, 28)
      : undefined,
    targetLinearTeam,
    githubTeamLabel,
    routingSource,
    individualOwnerRequired,
    individualOwnerDueAt: individualOwnerRequired
      ? addDays(issue.createdAt, 7)
      : undefined,
    highPriorityReviewDueAt:
      effectivePriority === 'high' || effectivePriority === 'urgent'
        ? addDays(issue.createdAt, 28)
        : undefined,
    needsInformationCloseDueAt:
      decision.automationFlow === 'needs-information' &&
      !employee.isEmployee &&
      effectivePriority !== 'high' &&
      effectivePriority !== 'urgent'
        ? addDays(issue.createdAt, 14)
        : undefined,
    needsInformationResponseWindowDays:
      decision.automationFlow === 'needs-information' &&
      !employee.isEmployee &&
      effectivePriority !== 'high' &&
      effectivePriority !== 'urgent'
        ? 14
        : undefined,
    parkingLotEligibleAt: inactiveParkingReview
      ? addMonths(lastActivityAt!, 3)
      : immediateParkingReview
        ? issue.createdAt
        : undefined,
    parkingLotInactivityMonths: 3,
    parkingLotReview,
    parkingLotGitHubLabel: 'Parking Lot',
    parkingLotLinearStatus: 'Canceled',
    parkingLotLinearStatusType: 'canceled',
    closurePolicy: employee.isEmployee
      ? resolutionAutomationCandidate
        ? 'after-validated-resolution'
        : 'human-only'
      : resolutionAutomationCandidate
        ? 'after-validated-resolution'
        : decision.actionability === 'needs-information'
          ? 'after-needs-information-timeout'
          : 'parking-lot-review',
    nextActions,
  };
}

export function buildShadowResult(
  issue: GitHubIssueContext,
  decisionInput: unknown,
  overridesInput: unknown,
  generatedAt: string,
  metadata?: Record<string, unknown>
): ShadowTriageResult {
  const decision = v.parse(TriageDecisionSchema, decisionInput);
  const overrides = v.parse(EmployeeOverridesSchema, overridesInput);
  if (
    decision.automationFlow === 'already-resolved' &&
    !issue.linkedPullRequests.some(pull => pull.merged && pull.relationship === 'closing')
  ) {
    throw new Error(
      'An already-resolved decision requires a verified merged pull request.'
    );
  }
  const policy = projectPolicy(issue, decision, overrides);
  const warnings = [
    'Shadow mode: no GitHub or Linear mutations were attempted.',
    'Lifecycle dates use issue creation as the provisional first-triage anchor until write mode persists exact event timestamps.',
  ];
  if (
    !issue.lastQualifyingLinearActivityAt &&
    policy.parkingLotReview !== 'immediate-priority-none'
  ) {
    warnings.push(
      'Parking Lot eligibility was withheld because qualifying Linear activity was not reconciled.'
    );
  }
  if (!issue.linearLinkback) {
    warnings.push('No exact Linear linkback was available at triage time.');
  }

  return {
    schemaVersion: 2,
    mode: 'shadow',
    generatedAt,
    issue,
    decision,
    policy,
    warnings,
    model: metadata?.model,
    usage: metadata?.usage,
  };
}
