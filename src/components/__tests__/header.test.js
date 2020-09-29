import React from "react";
import renderer from "react-test-renderer";
import Header from "../header";

jest.mock("../navbar", () => {
  return {
    __esModule: true,
    default: () => {
      return <div />;
    },
  };
});

describe("Header", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Header />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
