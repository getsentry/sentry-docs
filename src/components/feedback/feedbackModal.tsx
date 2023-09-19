import React, {Fragment, useEffect, useRef, useState} from 'react';
import styled from '@emotion/styled';

import {useFocusTrap} from '../hooks/useFocusTrap';
import {useShortcut} from '../hooks/useShortcut';

import {FeedbackForm} from './feedbackForm';
import {FeedbackSuccessMessage} from './feedbackSuccessMessage';
import {sendFeedbackRequest} from './sendFeedbackRequest';

interface RenderFunctionProps {
  /**
   * Is the modal open/visible
   */
  open: boolean;

  /**
   * Shows the feedback modal
   */
  showModal: () => void;
}
type FeedbackRenderFunction = (
  renderFunctionProps: RenderFunctionProps
) => React.ReactNode;

interface FeedbackModalProps {
  children: FeedbackRenderFunction;
  title: string;
}

interface FeedbackFormData {
  comment: string;
  email: string;
  name: string;
}

async function sendFeedback(
  data: FeedbackFormData,
  replayId: string,
  pageUrl: string
): Promise<Response | null> {
  const feedback = {
    message: data.comment,
    email: data.email,
    replay_id: replayId,
    url: pageUrl,
  };
  return await sendFeedbackRequest(feedback);
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation();
}

export function FeedbackModal({title, children}: FeedbackModalProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (data: FeedbackFormData) => {
    const replay = window.Sentry?.getCurrentHub?.()
      ?.getClient()
      ?.getIntegration(window.Sentry?.Replay);

    // Prepare session replay
    replay?.flush();
    const replayId = replay?.getReplayId();

    const pageUrl = document.location.href;

    sendFeedback(data, replayId, pageUrl).then(response => {
      if (response) {
        setOpen(false);
        setShowSuccessMessage(true);
      } else {
        // eslint-disable-next-line no-alert
        alert('Error submitting your feedback. Please try again');
      }
    });
  };

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!showSuccessMessage) {
      return () => {};
    }
    const timeout = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 6000);
    return () => {
      clearTimeout(timeout);
    };
  }, [showSuccessMessage]);

  useFocusTrap(dialogRef, open);
  useShortcut('Escape', handleClose);

  return (
    <Fragment>
      <Dialog id="feedbackModal" open={open} ref={dialogRef} onClick={handleClose}>
        <Content onClick={stopPropagation}>
          <Header>{title}</Header>
          {open && <FeedbackForm onSubmit={handleSubmit} onClose={handleClose} />}
        </Content>
      </Dialog>
      <FeedbackSuccessMessage show={showSuccessMessage} />
      {children({open, showModal})}
    </Fragment>
  );
}

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
