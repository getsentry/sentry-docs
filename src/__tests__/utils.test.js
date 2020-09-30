import { sortPages, parseBackticks } from "../utils";

const PAGE_ONE = { context: { title: "Test", sidebar_order: 5 } };
const PAGE_TWO = { context: { title: "Test Two", sidebar_order: 10 } };
const PAGE_THREE = { context: { title: "Test Three" } };

describe("sortPages", () => {
  it("sorts without extractor", () => {
    const result = sortPages([PAGE_ONE, PAGE_TWO, PAGE_THREE]);
    expect(result[0]).toBe(PAGE_ONE);
    expect(result[1]).toBe(PAGE_THREE);
    expect(result[2]).toBe(PAGE_TWO);
  });

  it("sorts with extractor", () => {
    const result = sortPages(
      [{ node: PAGE_ONE }, { node: PAGE_TWO }, { node: PAGE_THREE }],
      n => n.node
    );
    expect(result[0].node).toBe(PAGE_ONE);
    expect(result[1].node).toBe(PAGE_THREE);
    expect(result[2].node).toBe(PAGE_TWO);
  });
});

describe("parseBackticks", () => {
  it("converts a single code formatted string in a string", () => {
    const result = parseBackticks(
      "The `quick` brown fox jumps over the lazy dog."
    );
    expect(result).toBe(
      "The <code>quick</code> brown fox jumps over the lazy dog."
    );
  });

  it("coverts multiple code formatted strings in a string", () => {
    const result = parseBackticks(
      "The `quick` `brown` fox `jumps` over the lazy dog."
    );
    expect(result).toBe(
      "The <code>quick</code> <code>brown</code> fox <code>jumps</code> over the lazy dog."
    );
  });

  it("converts multiple backticks as code element", () => {
    const result = parseBackticks(
      'Possible values are: ``""`` (disable),``"24h"``, ``"14d"``'
    );

    expect(result).toBe(
      'Possible values are: <code>""</code> (disable),<code>"24h"</code>, <code>"14d"</code>'
    );
  });
});
