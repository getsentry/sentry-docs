import Gatsby from "gatsby";
import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import {
  Router,
  Link,
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router";
import "@testing-library/jest-dom/extend-expect";

import usePlatform from "../usePlatform";
import useLocalStorage from "../useLocalStorage";

import { useLocation } from "@reach/router";
import { useStaticQuery } from "gatsby";

const PLATFORMS = [
  {
    key: "javascript",
    name: "javascript",
    title: "JavaScript",
    guides: [],
  },
  {
    key: "ruby",
    name: "ruby",
    title: "Ruby",
    guides: [],
  },
];

jest.mock("@reach/router", () => ({
  ...jest.requireActual("@reach/router"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("../useLocalStorage");

describe("usePlatform", () => {
  it("uses the default of javascript", () => {
    useLocalStorage.mockReturnValue([null, jest.fn()]);
    useLocation.mockReturnValue({
      pathname: "/",
    });
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));

    const { result } = renderHook(() => usePlatform());
    expect(result.current[0].key).toBe("javascript");
  });

  it("identifies platform from route", () => {
    useLocalStorage.mockReturnValue([null, jest.fn()]);
    useLocation.mockReturnValue({
      pathname: "/platforms/ruby/",
    });
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));

    const { result } = renderHook(() => usePlatform());
    expect(result.current[0].key).toBe("ruby");
  });

  it("identifies platform from url", () => {
    useLocalStorage.mockReturnValue([null, jest.fn()]);
    useLocation.mockReturnValue({
      pathname: "/",
      search: "?platform=ruby",
    });
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));

    const { result } = renderHook(() => usePlatform());
    expect(result.current[0].key).toBe("ruby");
  });
});
