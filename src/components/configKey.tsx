import React from "react";

import usePlatform, { formatCaseStyle } from "./hooks/usePlatform";

type Props = {
  name: string;
  supported?: string[];
  notSupported?: string[];
  children?: React.ReactNode;
  platform?: string;
};

export default ({
  name,
  supported = [],
  notSupported = [],
  children,
  platform,
}: Props): JSX.Element => {
  const [currentPlatform] = usePlatform(platform);
  const isSupported = notSupported.length
    ? !notSupported.find(p => p === platform)
    : supported.length
    ? supported.find(p => p === platform)
    : true;

  if (!isSupported) return null;

  const header = (
    <h3>
      <code>{formatCaseStyle(currentPlatform.caseStyle, name)}</code>
    </h3>
  );

  if (children) {
    return (
      <div className={`unsupported ${!isSupported && "is-unsupported"}`}>
        {header}
        {!isSupported && (
          <div className="unsupported-hint">
            Not available for {currentPlatform.title}.
          </div>
        )}
        {children}
      </div>
    );
  }
  return header;
};
