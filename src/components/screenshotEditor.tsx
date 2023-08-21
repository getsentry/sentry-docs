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
  onSubmit: (screenshot: Blob, cutout?: Blob, selection?: Rect) => void;
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

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    });
  });
};
interface Point {
  x: number;
  y: number;
}

const constructRect = (start: Point, end: Point) => {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(start.x - end.x),
    height: Math.abs(start.y - end.y),
  };
};

export function ScreenshotEditor({dataUrl, onSubmit}: ScreenshotEditorProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const currentRatio = React.useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
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

      const rect = constructRect(rectStart, rectEnd);

      // draw gray overlay around the selectio
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, rect.y);
      ctx.fillRect(0, rect.y, rect.x, rect.height);
      ctx.fillRect(rect.x + rect.width, rect.y, canvas.width, rect.height);
      ctx.fillRect(0, rect.y + rect.height, canvas.width, canvas.height);

      // draw selection border
      ctx.strokeStyle = '#79628c';
      ctx.lineWidth = 6;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }

    async function submit(rect?: Rect) {
      const imageBlob = await canvasToBlob(canvas);
      if (!rect) {
        onSubmit(imageBlob);
        return;
      }
      const cutoutCanvas = document.createElement('canvas');
      cutoutCanvas.width = rect.width;
      cutoutCanvas.height = rect.height;
      const cutoutCtx = cutoutCanvas.getContext('2d');
      cutoutCtx.drawImage(
        canvas,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        0,
        0,
        rect.width,
        rect.height
      );
      const cutoutBlob = await canvasToBlob(cutoutCanvas);
      onSubmit(imageBlob, cutoutBlob, rect);
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
      submit(constructRect(rectStart, rectEnd));
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
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleEnterKey);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
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
