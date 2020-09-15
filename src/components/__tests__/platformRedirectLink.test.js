import React from "react";
import renderer from "react-test-renderer";

import PlatformRedirectLink from "../platformRedirectLink";

describe("PlatformRedirectLink", () => {
  it("renders with to", () => {
    const tree = renderer
      .create(<PlatformRedirectLink to="/enriching-error-data/" />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders without to", () => {
    const tree = renderer.create(<PlatformRedirectLink />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
