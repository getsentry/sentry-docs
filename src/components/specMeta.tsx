import {InfoCircledIcon} from '@radix-ui/react-icons';

import {SPEC_STATUS_BADGE, type SpecStatus} from './specConstants';

type SpecMetaProps = {
  status: SpecStatus;
  version: string;
  /** Value of the `spec_guidelines` frontmatter field, e.g. `writing-specs@0.1`. */
  guidelines?: string;
  /** Value of the `spec_kind` frontmatter field. `process` specs are not subject to the guidelines. */
  kind?: string;
};

const WRITING_SPECS_PATH = '/sdk/getting-started/standards/writing-specs/';

export function SpecMeta({version, status, guidelines, kind}: SpecMetaProps) {
  const badgeClass = SPEC_STATUS_BADGE[status];
  const isProcessSpec = kind === 'process';
  // `spec_guidelines` is `writing-specs@<major.minor>`; show just the version.
  const guidelinesVersion = guidelines?.match(/^writing-specs@(.+)$/)?.[1];

  return (
    <div className="not-prose mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Status</span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${badgeClass}`}
          >
            {status}
          </span>
          <a
            href="/sdk/getting-started/standards/spec-lifecycle"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Learn about spec statuses"
            title="Learn about spec statuses"
          >
            <InfoCircledIcon className="inline-block" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Version</span>
          <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium dark:bg-gray-700">
            {version}
          </code>
          <a
            href="#changelog"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            (changelog)
          </a>
        </div>
      </div>
      {guidelines && (
        <p className="mt-3 mb-0 text-gray-600 dark:text-gray-400">
          Follows <a href={WRITING_SPECS_PATH}>Writing SDK Specs</a>
          {guidelinesVersion ? ` version ${guidelinesVersion}` : ` (${guidelines})`}.
        </p>
      )}
      {!guidelines && !isProcessSpec && (
        <p className="mt-3 mb-0 text-gray-600 dark:text-gray-400">
          This spec predates the{' '}
          <a href={`${WRITING_SPECS_PATH}#legacy-specs`}>spec writing guidelines</a> and
          does not follow them yet. Requirements on behavior that is not externally
          observable are not mandatory, but SDKs should preserve the observable behavior
          that results from them.
        </p>
      )}
    </div>
  );
}
