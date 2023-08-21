import React from 'react';

import {FeebdackButton} from './feedbackButton';
import {FeedbackModal} from './feedbackModal';

export function FeebdackWidget() {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data: {comment: string; title: string}) => {
    console.log(data);
    setOpen(false);
  };

  return (
    <React.Fragment>
      {!open && <FeebdackButton onClick={() => setOpen(true)} />}
      <FeedbackModal open={open} onSubmit={handleSubmit} onClose={() => setOpen(false)} />
    </React.Fragment>
  );
}
