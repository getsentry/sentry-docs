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

import { useLocation, useNavigate } from "@reach/router";
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

  it("sets and navigates to new path", () => {
    useLocalStorage.mockReturnValue([null, jest.fn()]);
    useLocation.mockReturnValue({
      pathname: "/platforms/javascript/",
    });

    const navigate = jest.fn();

    useNavigate.mockImplementation(() => navigate);
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));

    const { result } = renderHook(() => usePlatform());

    act(() => {
      result.current[1]("ruby");
    });

    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate.mock.calls[0][0]).toBe("/platforms/ruby/");

    expect(result.current[0].key).toBe("ruby");
  });

  it("sets and navigates to doesnt navigate if path unchanged", () => {
    useLocalStorage.mockReturnValue([null, jest.fn()]);
    useLocation.mockReturnValue({
      pathname: "/platforms/ruby/",
    });

    const navigate = jest.fn();

    useNavigate.mockImplementation(() => navigate);
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));

    const { result } = renderHook(() => usePlatform());

    act(() => {
      result.current[1]("ruby");
    });

    expect(navigate.mock.calls.length).toBe(0);

    expect(result.current[0].key).toBe("ruby");
  });

  it("identifies platform from querystring", () => {
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

  it("sets and navigates to new querystring", () => {
    useLocalStorage.mockReturnValue([null, jest.fn()]);
    useLocation.mockReturnValue({
      pathname: "/",
      search: "?platform=javascript",
    });
    const navigate = jest.fn();

    useNavigate.mockImplementation(() => navigate);
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));

    const { result } = renderHook(() => usePlatform());

    act(() => {
      result.current[1]("ruby");
    });

    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate.mock.calls[0][0]).toBe("/?platform=ruby");

    expect(result.current[0].key).toBe("ruby");
  });
});
