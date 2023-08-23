import React, {FormEvent, useEffect} from 'react';
import {css} from '@emotion/react';
import styled from '@emotion/styled';

import {useFocusTrap} from './hooks/useFocusTrap';
import {useShortcut} from './hooks/useShortcut';
import {useTakeScreenshot} from './hooks/useTakeScreenhot';
import {ImageEditorWrapper} from './imageEditorWrapper';
import {Rect, ScreenshotEditor} from './screenshotEditor';

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
  background-color: #79628c;
  color: #fff;
  &:hover {
    background-color: #5f4b73;
  }
  &:focus-visible {
    outline: 1px solid #79628c;
    background-color: #5f4b73;
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
    outline: 1px solid #79628c;
    background-color: #eee;
  }
`;

const ScreenshotButton = styled.button`
  ${buttonStyles}
  background-color: #fff;
  color: #231c3d;
  font-weight: 500;
  &:hover {
    background-color: #eee;
  }
  &:focus-visible {
    outline: 1px solid #79628c;
    background-color: #eee;
  }
`;

const ScreenshotWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const ScreenshotPreview = styled.button`
  position: relative;
  display: block;
  flex: 1;
  min-width: 0;
  height: 160px;
  border-radius: 4px;
  border: 1px solid #ccc;
  overflow: hidden;
  &::after {
    content: 'Edit';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  &:hover {
    &::after {
      opacity: 1;
    }
  }
`;

const PreviewImage = styled.img`
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: contain;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.03) 5px,
    rgba(0, 0, 0, 0.03) 10px
  );
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
  onSubmit: (data: {
    comment: string;
    email: string;
    name: string;
    title: string;
    image?: Blob;
    imageCutout?: Blob;
    selection?: Rect;
  }) => void;
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

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export function FeedbackModal({open, onClose, onSubmit}: FeedbackModalProps) {
  const [screenshot, setScreenshot] = React.useState<Blob | undefined>(undefined);
  const [screenshotCutout, setScreenshotCutout] = React.useState<Blob | undefined>(
    undefined
  );
  const [screenshotPreview, setScreenshotPreview] = React.useState<string | undefined>(
    undefined
  );
  const [screenshotCutoutPreview, setScreenshotCutoutPreview] = React.useState<
    string | undefined
  >(undefined);
  const [isEditScreenshotOpen, setIsEditScreenshotOpen] = React.useState(false);
  const [isEditCutoutOpen, setIsEditCutoutOpen] = React.useState(false);

  const selectionRef = React.useRef<Rect | undefined>(undefined);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  useFocusTrap(dialogRef, open);
  useShortcut('Escape', onClose);
  const {isInProgress, takeScreenshot} = useTakeScreenshot();

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        formRef.current.reset();
        setScreenshot(undefined);
        setScreenshotCutout(undefined);
        setScreenshotPreview(undefined);
      }, 200);
    }
  }, [open]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      comment: retrieveStringValue(formData, 'comment'),
      title: retrieveStringValue(formData, 'title'),
      name: retrieveStringValue(formData, 'name'),
      email: retrieveStringValue(formData, 'email'),
      image: screenshot,
      imageCutout: screenshotCutout,
      selection: selectionRef.current,
    });
  };

  const handleScreenshot = async () => {
    try {
      const image = await takeScreenshot();
      setScreenshotPreview(image);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const handleEditorSubmit = async (
    newScreenshot: Blob,
    cutout?: Blob,
    selection?: Rect
  ) => {
    setScreenshot(newScreenshot);
    setScreenshotCutout(cutout);
    setScreenshotPreview(await blobToBase64(newScreenshot));
    setScreenshotCutoutPreview(cutout && (await blobToBase64(cutout)));
    selectionRef.current = selection;
  };

  return (
    <React.Fragment>
      <Dialog
        id="feedbackModal"
        open={open && !isInProgress}
        ref={dialogRef}
        onClick={onClose}
      >
        <Content onClick={stopPropagation}>
          <Header>Got any Feedback?</Header>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Label>
              Title
              <Input required type="text" name="title" placeholder="Enter a subject" />
            </Label>
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
            <FlexColumns>
              <Label>
                Name (optional)
                <Input type="text" name="name" placeholder="Anonymous" />
              </Label>
              <Label>
                Email (optional)
                <Input type="text" name="email" placeholder="you@test.com" />
              </Label>
            </FlexColumns>
            <Label>Screenshot</Label>
            {screenshotPreview ? (
              <ScreenshotWrapper>
                <ScreenshotPreview
                  type="button"
                  onClick={() => setIsEditScreenshotOpen(true)}
                >
                  <PreviewImage src={screenshotPreview} />
                </ScreenshotPreview>
                {screenshotCutout && (
                  <ScreenshotPreview
                    type="button"
                    onClick={() => setIsEditCutoutOpen(true)}
                  >
                    <PreviewImage src={screenshotCutoutPreview} />
                  </ScreenshotPreview>
                )}
              </ScreenshotWrapper>
            ) : (
              <ScreenshotButton type="button" onClick={handleScreenshot}>
                Add Screenshot
              </ScreenshotButton>
            )}
            <ModalFooter>
              <CancelButton type="button" onClick={onClose}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit">Submit</SubmitButton>
            </ModalFooter>
          </Form>
        </Content>
      </Dialog>
      {screenshotPreview && !screenshot && (
        <ScreenshotEditor dataUrl={screenshotPreview} onSubmit={handleEditorSubmit} />
      )}
      {isEditScreenshotOpen && (
        <ImageEditorWrapper
          src={screenshotPreview}
          onSubmit={async newScreenshot => {
            setScreenshot(newScreenshot);
            setScreenshotPreview(await blobToBase64(newScreenshot));
            setIsEditScreenshotOpen(false);
          }}
          onCancel={() => {
            setIsEditScreenshotOpen(false);
          }}
        />
      )}
      {isEditCutoutOpen && (
        <ImageEditorWrapper
          src={screenshotCutoutPreview}
          onSubmit={async newCutout => {
            setScreenshotCutout(newCutout);
            setScreenshotCutoutPreview(await blobToBase64(newCutout));
            setIsEditCutoutOpen(false);
          }}
          onCancel={() => {
            setIsEditCutoutOpen(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
