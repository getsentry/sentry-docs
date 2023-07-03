import React from 'react';
import styled from '@emotion/styled';

import SentryDocsBot from 'sentry-docs/logos/chatbot.svg';

const DocsBotStyle = styled.div`
  display: flex;
  flex-basis: 30%;
  height: 2.5rem;
  overflow: hidden;
  background: #ffffff;
  color: #231c3d;
  border-radius: 0.5rem;
  padding: 0.2rem 0.3rem;
  padding-left: 0.6rem;
  padding-right: 0.2rem;
  text-align: right;
  line-height: 2;
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
  @media only screen and (max-width: 768px) {
    span {
      display: none;
    }
  }
  a {
    text-decoration: none;
    color: #231c3d;
  }
`;

export function DocsBot(): JSX.Element {
  return (
    <DocsBotStyle>
      <a
        href="https://docsbot.ai/chat/skFEy0qDC01GrRrZ7Crs/EPqsd8nu2XmKzWnd45tL"
        target="_blank"
        rel="noreferrer"
      >
        <img width="50" style={{marginRight: '10px'}} src={SentryDocsBot} />
        <span>ask our Bot</span>
      </a>
    </DocsBotStyle>
  );
}
