import React from "react";
import { connectSearchBox } from "react-instantsearch-dom";

export default connectSearchBox(({ currentRefinement, refine, ...props }) => (
  <input
    type="search"
    placeholder="Search"
    aria-label="Search"
    className="form-control"
    onChange={(e) => refine(e.target.value)}
    value={currentRefinement}
    {...props}
  />
));
