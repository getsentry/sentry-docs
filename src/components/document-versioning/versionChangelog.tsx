type ChangelogEntry = {
  date: string;
  summary: string;
  version: string;
};

type VersionChangelogProps = {
  changelog: ChangelogEntry[];
};

export function VersionChangelog({changelog}: VersionChangelogProps) {
  if (!changelog || changelog.length === 0) {
    return null;
  }

  return (
    <div className="not-prose text-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500">
            <th className="py-2 pr-4 font-medium">Version</th>
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 font-medium">Summary</th>
          </tr>
        </thead>
        <tbody>
          {changelog.map(entry => (
            <tr
              key={entry.version}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              <td className="py-2 pr-4">
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium dark:bg-gray-800">
                  {entry.version}
                </code>
              </td>
              <td className="py-2 pr-4 text-gray-500">{entry.date}</td>
              <td className="py-2 text-gray-700 dark:text-gray-300">{entry.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
