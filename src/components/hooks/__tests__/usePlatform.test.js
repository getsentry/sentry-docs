import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";

import PageContext from "../../pageContext";
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
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{}}>{children}</PageContext.Provider>
    );

    useLocalStorage.mockReturnValue([null, jest.fn()]);
    useLocation.mockReturnValue({
      pathname: "/",
    });
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));

    const { result } = renderHook(() => usePlatform(), { wrapper });
    expect(result.current[0].key).toBe("javascript");
  });

  it("identifies platform from route", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{ platform: { name: "ruby" } }}>
        {children}
      </PageContext.Provider>
    );

    useLocalStorage.mockReturnValue([null, jest.fn()]);
    useLocation.mockReturnValue({
      pathname: "/platforms/ruby/",
    });
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));

    const { result } = renderHook(() => usePlatform(), { wrapper });
    expect(result.current[0].key).toBe("ruby");
  });

  it("sets and navigates to new path", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{ platform: { name: "ruby" } }}>
        {children}
      </PageContext.Provider>
    );

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

    const { result } = renderHook(() => usePlatform(), { wrapper });

    act(() => {
      result.current[1]("javascript");
    });

    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate.mock.calls[0][0]).toBe("/platforms/javascript/");

    expect(result.current[0].key).toBe("javascript");
  });

  it("sets and navigates to doesnt navigate if path unchanged", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{ platform: { name: "ruby" } }}>
        {children}
      </PageContext.Provider>
    );

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

    const { result } = renderHook(() => usePlatform(), { wrapper });

    act(() => {
      result.current[1]("ruby");
    });

    expect(navigate.mock.calls.length).toBe(0);

    expect(result.current[0].key).toBe("ruby");
  });

  it("identifies platform from querystring", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{}}>{children}</PageContext.Provider>
    );

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

    const { result } = renderHook(() => usePlatform(), { wrapper });
    expect(result.current[0].key).toBe("ruby");
  });

  it("sets and navigates to new querystring", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{}}>{children}</PageContext.Provider>
    );

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

    const { result } = renderHook(() => usePlatform(), { wrapper });

    act(() => {
      result.current[1]("ruby");
    });

    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate.mock.calls[0][0]).toBe("/?platform=ruby");

    expect(result.current[0].key).toBe("ruby");
  });
});
