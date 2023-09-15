import React, {FormEvent, useEffect, useRef} from 'react';
import {css} from '@emotion/react';
import styled from '@emotion/styled';

import {useFocusTrap} from '../hooks/useFocusTrap';
import {useShortcut} from '../hooks/useShortcut';

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
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
  &:not([open]) {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }
`;

const Content = styled.div`
  border-radius: 4px;
  background-color: #fff;
  width: 500px;
  max-width: 100%;
  max-height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;
  transform: translate(0, 0) scale(1);
  dialog:not([open]) & {
    transform: translate(0, -16px) scale(0.98);
  }
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
  overflow: auto;
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
    outline: 1px solid rgba(108, 95, 199, 1);
    border-color: rgba(108, 95, 199, 1);
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

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const buttonStyles = css`
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
`;

const SubmitButton = styled.button`
  ${buttonStyles}
  background-color: rgba(108, 95, 199, 1);
  color: #fff;
  &:hover {
    background-color: rgba(88, 74, 192, 1);
  }
  &:focus-visible {
    outline: 1px solid rgba(108, 95, 199, 1);
    background-color: rgba(88, 74, 192, 1);
  }
`;

const CancelButton = styled.button`
  ${buttonStyles}
  background-color: #fff;
  color: #231c3d;
  font-weight: 500;
  &:hover {
    background-color: #eee;
  }
  &:focus-visible {
    outline: 1px solid rgba(108, 95, 199, 1);
    background-color: #eee;
  }
`;

const FlexColumns = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  & > * {
    flex: 1;
  }
`;

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (data: {comment: string; email: string; name: string}) => void;
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useFocusTrap(dialogRef, open);
  useShortcut('Escape', onClose);

  // Reset on close
  useEffect(() => {
    let timeoutId: number | undefined;

    if (!open) {
      timeoutId = setTimeout(() => {
        formRef.current.reset();
      }, 200);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [open]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      name: retrieveStringValue(formData, 'name'),
      email: retrieveStringValue(formData, 'email'),
      comment: retrieveStringValue(formData, 'comment'),
    });
  };

  const user = window.Sentry?.getCurrentHub().getScope()?.getUser();

  return (
    <Dialog id="feedbackModal" open={open} ref={dialogRef} onClick={onClose}>
      <Content onClick={stopPropagation}>
        <Header>Got any Feedback?</Header>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <FlexColumns>
            <Label>
              Your Name
              <Input
                type="text"
                name="name"
                placeholder="Anonymous"
                defaultValue={user?.username}
              />
            </Label>
            <Label>
              Your Email
              <Input
                type="text"
                name="email"
                placeholder="you@test.com"
                defaultValue={user?.email}
              />
            </Label>
          </FlexColumns>
          <Label>
            Comment
            <TextArea
              onKeyDown={event => {
                if (event.key === 'Enter' && event.ctrlKey) {
                  formRef.current.requestSubmit();
                }
              }}
              name="comment"
              placeholder="Explain what bothers you"
            />
          </Label>
          <ModalFooter>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit">Submit</SubmitButton>
          </ModalFooter>
        </Form>
      </Content>
    </Dialog>
  );
}
