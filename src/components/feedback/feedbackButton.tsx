import React from 'react';
import styled from '@emotion/styled';

import feedbackIcon from '../../logos/feedback.svg';

const Button = styled.button`
  position: fixed;
  right: 1rem;
  bottom: 1rem;

  display: flex;
  align-items: center;
  gap: 8px;

  border: 1.5px solid rgba(41, 35, 47, 0.13);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 4px 24px 0px rgba(43, 34, 51, 0.12);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  text-decoration: none;
  z-index: 9000;

  &:hover {
    background-color: #eee;
  }
`;

const ButtonText = styled.span`
  @media (max-width: 576px) {
    display: none;
  }
`;

export function FeedbackButton(props) {
  return (
    <Button {...props}>
      <img src={feedbackIcon} alt="Report a bug icon" />
      <ButtonText>Report a Bug</ButtonText>
    </Button>
  );
}
