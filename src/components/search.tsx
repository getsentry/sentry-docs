import styled from "@emotion/styled";
import { useRef, useState } from "react";

import {DocsBotButton} from './docsBotButton';

type Props = {
  autoFocus?: boolean;
  path?: string;
  platforms?: string[];
};

export function Search({path, autoFocus, platforms = []}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, _setQuery] = useState(``);

  return (
    <div ref={ref}>
      <SearchBar>
        <input
          type="search"
          placeholder="Search"
          aria-label="Search"
          className="form-control search-input"
          value={query}
          readOnly // temp
        />
        <Separator>Feeling bold?</Separator>
        <DocsBotButton />
      </SearchBar>
    </div>
  );
}

const SearchBar = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const Separator = styled('div')`
  white-space: nowrap;
`;
