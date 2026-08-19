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

export const PrioritySchema = v.picklist(['urgent', 'high', 'medium', 'low']);
export const EffortSchema = v.picklist(['small', 'medium', 'large']);

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
  platform: v.optional(PlatformSchema),
  productArea: v.optional(ProductAreaSchema),
  team: TeamSchema,
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
      kind: v.picklist(['content-edit', 'redirect', 'application-code']),
      description: shortText(),
      targetFiles: v.pipe(v.array(shortText()), v.maxLength(5)),
    })
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
      decision.recommendedAction === 'request-information' &&
      decision.missingInformation.length > 0
    );
  }
  if (decision.automationFlow === 'broken-link-fix') {
    return (
      decision.classification === 'broken-link' &&
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
  individualOwnerRequired: boolean;
  individualOwnerDueAt?: string;
  highPriorityReviewDueAt?: string;
  highPriorityReviewIntervalDays?: 28;
  needsInformationCloseDueAt?: string;
  needsInformationResponseWindowDays?: 14;
  parkingLotEligibleAt?: string;
  parkingLotInactivityMonths: 6;
  parkingLotGitHubLabel: 'Parking Lot';
  parkingLotLinearStatus: 'Canceled';
  parkingLotLinearStatusType: 'canceled';
  closurePolicy:
    | 'human-only'
    | 'after-validated-resolution'
    | 'after-needs-information-timeout'
    | 'parking-lot-only';
  nextActions: string[];
}

export interface ShadowTriageResult {
  schemaVersion: 1;
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
    (decision.automationFlow === 'broken-link-fix' &&
      decision.confidence >= 0.9 &&
      decision.quickFix !== undefined) ||
    (decision.automationFlow === 'already-resolved' &&
      issue.linkedPullRequests.some(
        pull => pull.merged && pull.relationship === 'closing'
      )) ||
    (decision.automationFlow === 'duplicate' &&
      decision.confidence >= 0.95 &&
      decision.potentialDuplicate !== undefined);
  const employeeProtectionApplies = employee.isEmployee && !resolutionAutomationCandidate;
  const employeeProtectionsDeferred =
    employee.isEmployee && resolutionAutomationCandidate;
  const effectivePriority = employeeProtectionApplies
    ? minimumHigh(decision.priority)
    : decision.priority;
  const nextActions: string[] = [];

  if (resolutionAutomationCandidate) {
    nextActions.push(
      'Validate the recommended resolution flow before allowing closure; apply the explicit employee fallback if validation fails.'
    );
  } else {
    nextActions.push(`Route to ${decision.team} at ${effectivePriority} priority.`);
  }

  if (employeeProtectionApplies) {
    nextActions.push(
      'Require an individual Linear assignee within seven days of creation.'
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
    employeeFallbackPriority: employeeProtectionsDeferred
      ? minimumHigh(decision.priority)
      : undefined,
    employeeFallbackOwnerDueAt: employeeProtectionsDeferred
      ? addDays(issue.createdAt, 7)
      : undefined,
    employeeFallbackHighPriorityReviewDueAt: employeeProtectionsDeferred
      ? addDays(issue.createdAt, 28)
      : undefined,
    individualOwnerRequired: employeeProtectionApplies,
    individualOwnerDueAt: employeeProtectionApplies
      ? addDays(issue.createdAt, 7)
      : undefined,
    highPriorityReviewDueAt:
      effectivePriority === 'high' || effectivePriority === 'urgent'
        ? addDays(issue.createdAt, 28)
        : undefined,
    highPriorityReviewIntervalDays:
      effectivePriority === 'high' || effectivePriority === 'urgent' ? 28 : undefined,
    needsInformationCloseDueAt:
      decision.automationFlow === 'needs-information' && !employee.isEmployee
        ? addDays(issue.createdAt, 14)
        : undefined,
    needsInformationResponseWindowDays:
      decision.automationFlow === 'needs-information' && !employee.isEmployee
        ? 14
        : undefined,
    parkingLotEligibleAt:
      employee.isEmployee || !issue.lastQualifyingLinearActivityAt
        ? undefined
        : addMonths(
            [issue.lastQualifyingGitHubActivityAt, issue.lastQualifyingLinearActivityAt]
              .sort()
              .at(-1)!,
            6
          ),
    parkingLotInactivityMonths: 6,
    parkingLotGitHubLabel: 'Parking Lot',
    parkingLotLinearStatus: 'Canceled',
    parkingLotLinearStatusType: 'canceled',
    closurePolicy: employee.isEmployee
      ? resolutionAutomationCandidate
        ? 'after-validated-resolution'
        : 'human-only'
      : resolutionAutomationCandidate
        ? 'after-validated-resolution'
        : decision.automationFlow === 'needs-information'
          ? 'after-needs-information-timeout'
          : 'parking-lot-only',
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
  const warnings = [
    'Shadow mode: no GitHub or Linear mutations were attempted.',
    'Lifecycle dates use issue creation as the provisional first-triage anchor until write mode persists exact event timestamps.',
  ];
  if (!issue.lastQualifyingLinearActivityAt) {
    warnings.push(
      'Parking Lot eligibility was withheld because qualifying Linear activity was not reconciled.'
    );
  }
  if (!issue.linearLinkback) {
    warnings.push('No exact Linear linkback was available at triage time.');
  }

  return {
    schemaVersion: 1,
    mode: 'shadow',
    generatedAt,
    issue,
    decision,
    policy: projectPolicy(issue, decision, overrides),
    warnings,
    model: metadata?.model,
    usage: metadata?.usage,
  };
}
