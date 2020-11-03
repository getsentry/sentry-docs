import { sortPages } from "../utils";

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
