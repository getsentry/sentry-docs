import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";

import ConfigKey from "../configKey";
import usePlatform from "../hooks/usePlatform";

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
    const tree = renderer
      .create(<ConfigKey name="my-option-name" />, {
        path: "/",
      })
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
