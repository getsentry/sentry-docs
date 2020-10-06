import React from "react";

import PlatformSection from "./platformSection";
import PlatformIdentifier from "./platformIdentifier";

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
  // This is a literal copypaste of the HTML Gatsby outputs for regular
  // Markdown headings because we can't figure out how to make Gatsby
  // render component content like regular markdown/MDX content. We tried
  // MDXRenderer but that one needs "compiled MDX" which we are unable to
  // obtain. We might get one if we inserted a graphql node somewhere but
  // who knows at this point.

  return (
    <PlatformSection
      supported={supported}
      notSupported={notSupported}
      platform={platform}
    >
      <h3 id={name}>
        <a href={`#${name}`} className="anchor before" aria-label="common options permalink">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.879 6.05L15 1.93A5.001 5.001 0 0 1 22.071 9l-4.121 4.121a1 1 0 0 1-1.414-1.414l4.12-4.121a3 3 0 1 0-4.242-4.243l-4.121 4.121a1 1 0 1 1-1.414-1.414zm2.242 11.9L9 22.07A5 5 0 1 1 1.929 15l4.121-4.121a1 1 0 0 1 1.414 1.414l-4.12 4.121a3 3 0 1 0 4.242 4.243l4.121-4.121a1 1 0 1 1 1.414 1.414zm-8.364-.122l13.071-13.07a1 1 0 0 1 1.415 1.414L6.172 19.242a1 1 0 1 1-1.415-1.414z" fill="currentColor"></path>
          </svg>
        </a>
        <PlatformIdentifier platform={platform} name={name} />
      </h3>

      {children}
    </PlatformSection>
  );
};
