import React, {FormEvent} from 'react';
import {css} from '@emotion/react';
import styled from '@emotion/styled';

import {useFocusTrap} from './hooks/useFocusTrap';
import {useShortcut} from './hooks/useShortcut';

const Dialog = styled.dialog`
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  position: fixed;
  inset: 0;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  &:not([open]) {
    opacity: 0;
    pointer-events: none;
  }
`;

const Content = styled.div`
  border-radius: 4px;
  background-color: #fff;
  width: 500px;
  max-width: 100%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const Header = styled.h2`
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  padding: 20px 24px;
  margin: 0px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0px;
`;

const inputStyles = css`
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  padding: 6px 8px;
  &:focus {
    outline: 1px solid #79628c;
    border-color: #79628c;
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 64px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #79628c;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
  align-self: flex-end;
  margin-top: 8px;
  &:hover {
    background-color: #5f4b73;
  }
  &:focus-visible {
    outline: 1px solid #79628c;
    background-color: #5f4b73;
  }
`;

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (data: {comment: string; title: string}) => void;
  open: boolean;
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation();
}

const retrieveStringValue = (formData: FormData, key: string) => {
  const value = formData.get(key);
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
};

export function FeedbackModal({open, onClose, onSubmit}: FeedbackModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  useFocusTrap(dialogRef, open);

  useShortcut('Escape', onClose);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      comment: retrieveStringValue(formData, 'comment'),
      title: retrieveStringValue(formData, 'title'),
    });
    formRef.current.reset();
  };

  return (
    <Dialog open={open} ref={dialogRef} onClick={onClose}>
      <Content onClick={stopPropagation}>
        <Header>Got any Feedback?</Header>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Label>
            Title:
            <Input required type="text" name="title" placeholder="Enter a subject" />
          </Label>
          <Label>
            Comment:
            <TextArea
              onKeyDown={event => {
                if (event.key === 'Enter' && event.ctrlKey) {
                  formRef.current.requestSubmit();
                }
              }}
              name="title"
              placeholder="Explain what bothers you"
            />
          </Label>
          <SubmitButton type="submit">Submit</SubmitButton>
        </Form>
      </Content>
    </Dialog>
  );
}
