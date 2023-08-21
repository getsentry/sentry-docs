import React, {useEffect, useState} from 'react';
import styled from '@emotion/styled';

import {ScreenshotEditorHelp} from './screenshotEditorHelp';

interface Rect {
  height: number;
  width: number;
  x: number;
  y: number;
}
interface ScreenshotEditorProps {
  dataUrl: string;
  onSubmit: (screenshot: Blob, selection?: Rect) => void;
}

const Canvas = styled.canvas`
  position: absolute;
  cursor: crosshair;
  max-width: 100vw;
  max-height: 100vh;
`;
const Container = styled.div`
  position: fixed;
  z-index: 10000;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background-color: #ccc;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 16px,
    rgba(0, 0, 0, 0.2) 16px,
    rgba(0, 0, 0, 0.2) 17.5px
  );
`;

const getCanvasRenderSize = (width: number, height: number) => {
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  if (width > maxWidth) {
    height = (maxWidth / width) * height;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (maxHeight / height) * width;
    height = maxHeight;
  }

  return {width, height};
};

export function ScreenshotEditor({dataUrl, onSubmit}: ScreenshotEditorProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const currentRatio = React.useRef<number>(1);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const rectStart: {x: number; y: number} = {x: 0, y: 0};
    const rectEnd: {x: number; y: number} = {x: 0, y: 0};
    let isDragging = false;

    function setCanvasSize() {
      const renderSize = getCanvasRenderSize(img.width, img.height);
      canvas.style.width = `${renderSize.width}px`;
      canvas.style.height = `${renderSize.height}px`;
      canvas.style.top = `${(window.innerHeight - renderSize.height) / 2}px`;
      canvas.style.left = `${(window.innerWidth - renderSize.width) / 2}px`;
      // store it so we can translate the selection
      currentRatio.current = renderSize.width / img.width;
    }

    function refreshCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (!isDragging) {
        return;
      }

      // draw gray overlay around the selection
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, rectStart.y);
      ctx.fillRect(0, rectStart.y, rectStart.x, rectEnd.y - rectStart.y);
      ctx.fillRect(
        rectEnd.x,
        rectStart.y,
        canvas.width - rectEnd.x,
        rectEnd.y - rectStart.y
      );
      ctx.fillRect(0, rectEnd.y, canvas.width, canvas.height - rectEnd.y);

      ctx.strokeStyle = '#79628c';
      ctx.lineWidth = 6;
      ctx.strokeRect(
        rectStart.x,
        rectStart.y,
        rectEnd.x - rectStart.x,
        rectEnd.y - rectStart.y
      );
    }

    function submit(rect?: Rect) {
      canvasRef.current.toBlob(blob => {
        onSubmit(blob, rect);
      });
    }

    function handleMouseDown(e) {
      rectStart.x = e.offsetX / currentRatio.current;
      rectStart.y = e.offsetY / currentRatio.current;
      isDragging = true;
      setIsDraggingState(true);
    }
    function handleMouseMove(e) {
      rectEnd.x = e.offsetX / currentRatio.current;
      rectEnd.y = e.offsetY / currentRatio.current;
      refreshCanvas();
    }
    function handleMouseUp() {
      isDragging = false;
      setIsDraggingState(false);
      if (rectStart.x - rectEnd.x === 0 && rectStart.y - rectEnd.y === 0) {
        // no selection
        refreshCanvas();
        return;
      }
      submit({
        x: rectStart.x,
        y: rectStart.y,
        width: rectEnd.x - rectStart.x,
        height: rectEnd.y - rectStart.y,
      });
    }

    function handleEnterKey(e) {
      if (e.key === 'Enter') {
        submit();
      }
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      setCanvasSize();
      ctx.drawImage(img, 0, 0);
    };

    img.src = dataUrl;

    window.addEventListener('resize', setCanvasSize, {passive: true});
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleEnterKey);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleEnterKey);
    };
  }, [dataUrl]);

  return (
    <Container>
      <Canvas ref={canvasRef} />
      <ScreenshotEditorHelp hide={isDraggingState} />
    </Container>
  );
}
