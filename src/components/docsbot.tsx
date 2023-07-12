import React from 'react';
import styled from '@emotion/styled';

import SentryDocsBot from 'sentry-docs/logos/chatbot.svg';

export function DocsBot() {
  return (
    <DocsBotLink
      href="https://docsbot.ai/chat/skFEy0qDC01GrRrZ7Crs/EPqsd8nu2XmKzWnd45tL"
      target="_blank"
      rel="noreferrer"
    >
      <img width="50" src={SentryDocsBot} />
      <span>Ask our Bot</span>
    </DocsBotLink>
  );
}

const DocsBotLink = styled('a')`
  display: flex;
  gap: 0.75rem;
  height: 2.5rem;
  background: #ffffff;
  color: #231c3d;
  border-radius: 0.5rem;
  padding: 0.2rem 0.75rem;
  line-height: 1.1;
  align-items: center;

  transition-property: box-shadow, border-color;
  transition-duration: 0.25s;
  transition-timing-function: ease-out;
  box-shadow: 0 2px 0 rgba(54, 45, 89, 0.15);

  &:hover {
    box-shadow: 0 2px 0 rgba(54, 45, 89, 0.15), -0.1875rem -0.1875rem 0 0.1875rem #f2b712,
      0 0 0 0.375rem #e1567c;
    text-decoration: none;
    cursor: pointer;
  }

  img {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: 50px;
  }

  span {
    white-space: nowrap;
  }

  @media only screen and (max-width: 1200px) {
    span {
      display: none;
    }
  }
`;
