import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";

import PlatformSection from "../platformSection";
import usePlatform from "../hooks/usePlatform";

jest.mock("../hooks/usePlatform");

describe("PlatformSection", () => {
  it("hides content without supported platform", () => {
    usePlatform.mockReturnValue([
      {
        key: "ruby",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection supported={["python"]}>Test</PlatformSection>, {
        path: "/",
      })
      .toJSON();

    expect(tree).toBe(null);
  });

  it("shows content with supported platform", () => {
    usePlatform.mockReturnValue([
      {
        key: "python",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection supported={["python"]}>Test</PlatformSection>, {
        path: "/",
      })
      .toJSON();

    expect(tree).toBe("Test");
  });

  it("shows content with supported parent platform", () => {
    usePlatform.mockReturnValue([
      {
        key: "ruby.rails",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection supported={["ruby"]}>Test</PlatformSection>, {
        path: "/",
      })
      .toJSON();

    expect(tree).toBe("Test");
  });

  it("hides content with notSupported platform", () => {
    usePlatform.mockReturnValue([
      {
        key: "ruby",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection notSupported={["ruby"]}>Test</PlatformSection>, {
        path: "/",
      })
      .toJSON();

    expect(tree).toBe(null);
  });

  it("hides content with notSupported parent platform", () => {
    usePlatform.mockReturnValue([
      {
        key: "ruby.rails",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection notSupported={["ruby"]}>Test</PlatformSection>, {
        path: "/",
      })
      .toJSON();

    expect(tree).toBe(null);
  });

  it("shows content without notSupported platform", () => {
    usePlatform.mockReturnValue([
      {
        key: "python",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection notSupported={["ruby"]}>Test</PlatformSection>, {
        path: "/",
      })
      .toJSON();

    expect(tree).toBe("Test");
  });

  it("shows content with supported child platform, notSupported parent", () => {
    usePlatform.mockReturnValue([
      {
        key: "ruby.rails",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(
        <PlatformSection supported={["ruby.rails"]} notSupported={["ruby"]}>
          Test
        </PlatformSection>,
        {
          path: "/",
        }
      )
      .toJSON();

    expect(tree).toBe("Test");
  });
});
