import React from 'react';
import styled from '@emotion/styled';

const Button = styled.button`
  position: fixed;
  right: 0px;
  bottom: 50%;
  transform: translate(25%, 50%) rotate(-90deg);
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #231c3d;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
  text-align: center;
  text-decoration: none;
  z-index: 9000;
`;

export function FeebdackButton(props) {
  return <Button {...props}>Feedback</Button>;
}
