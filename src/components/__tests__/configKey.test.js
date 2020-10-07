import React from "react";
import renderer from "react-test-renderer";

import ConfigKey from "../configKey";
import usePlatform, { getPlatformsWithFallback } from "../hooks/usePlatform";

jest.mock("../hooks/usePlatform");

describe("ConfigKey", () => {
  it("renders correctly", () => {
    usePlatform.mockReturnValue([
      {
        key: "ruby",
        caseStyle: "snake_case",
      },
      jest.fn(),
      false,
    ]);
    getPlatformsWithFallback.mockReturnValue(["ruby.rails", "ruby"]);
    const tree = renderer
      .create(<ConfigKey name="my-option-name" />, {
        path: "/",
      })
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
