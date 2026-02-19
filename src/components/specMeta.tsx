import {SPEC_STATUS_BADGE,type SpecStatus} from './specConstants';

type SpecMetaProps = {
  status: SpecStatus;
  version: string;
};

export function SpecMeta({version, status}: SpecMetaProps) {
  const badgeClass = SPEC_STATUS_BADGE[status];

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
    </div>
  );
}
