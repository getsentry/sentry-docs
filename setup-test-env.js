// https://www.gatsbyjs.com/docs/unit-testing/
import "@testing-library/jest-dom/extend-expect";

global.___loader = {
  enqueue: jest.fn(),
};
