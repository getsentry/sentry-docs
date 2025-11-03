type AvailableSinceProps = {
  version: string;
};

/**
 * AvailableSince displays version availability information in a consistent format.
 *
 * Use this component to indicate when a feature, API, or option became available.
 *
 * @param version - The version number (e.g., "10.0.0", "8.5.0")
 */
export function AvailableSince({
  version,
}: AvailableSinceProps) {
  return (
    <p className="italic">
      Available since: <code>v{version.replace(/^v/, '')}</code>
    </p>
  );
}

