import React, {ComponentType, useCallback, useEffect, useMemo, useState} from 'react';
import styled from '@emotion/styled';

import {ToolKey, Tools, useImageEditor} from './hooks/useImageEditor';
import {ArrowIcon, HandIcon, PenIcon, RectangleIcon} from './hooks/useImageEditor/icons';

export interface Rect {
  height: number;
  width: number;
  x: number;
  y: number;
}
interface ImageEditorWrapperProps {
  onCancel: () => void;
  onSubmit: (screenshot: Blob) => void;
  src: string;
}

const Canvas = styled.canvas`
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
  background-color: #fff;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.03) 5px,
    rgba(0, 0, 0, 0.03) 10px
  );
`;

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 32px;
  height: calc(100% - 96px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToolbarGroup = styled.div`
  display: flex;
  flex-direction: row;
  height: 48px;
  background-color: #7669d3;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const Toolbar = styled.div`
  position: absolute;
  width: 100%;
  bottom: 8px;
  display: flex;
  gap: 16px;
  flex-direction: row;
  justify-content: center;
`;

const ToolButton = styled.button<{active: boolean}>`
  width: 48px;
  height: 48px;
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #4939ba;
  }
  &:focus {
    outline: none;
  }
  &:not(:last-child) {
  }
  ${({active}) =>
    active &&
    `
    background-color: #4939ba;
  `}
`;

const CancelButton = styled.button`
  height: 48px;
  padding: 0 24px;
  border: none;
  background-color: #999;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #4939ba;
  }
  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.button`
  height: 48px;
  padding: 0 24px;
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #4939ba;
  }
  &:focus {
    outline: none;
  }
`;

const ColorInput = styled.label<{background: string}>`
  position: relative;
  display: block;
  width: 48px;
  height: 48px;
  margin: 0;
  cursor: pointer;
  ${({background}) => `background-color: ${background};`}
  & input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 0;
    height: 0;
  }
  &::after {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    border: 4px solid rgba(0, 0, 0, 0.2);
    pointer-events: none;
  }
`;

const iconMap: Record<ToolKey, ComponentType> = {
  arrow: ArrowIcon,
  pen: PenIcon,
  rectangle: RectangleIcon,
};

const getCanvasRenderSize = (
  canvas: HTMLCanvasElement,
  containerElement: HTMLDivElement
) => {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const maxWidth = containerElement.getBoundingClientRect().width;
  const maxHeight = containerElement.getBoundingClientRect().height;
  // fit canvas to window
  let width = canvasWidth;
  let height = canvasHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  const windowRatio = maxWidth / maxHeight;

  if (canvasRatio > windowRatio && canvasWidth > maxWidth) {
    height = (maxWidth / canvasWidth) * canvasHeight;
    width = maxWidth;
  }

  if (canvasRatio < windowRatio && canvasHeight > maxHeight) {
    width = (maxHeight / canvasHeight) * canvasWidth;
    height = maxHeight;
  }

  return {width, height};
};

const srcToImage = (src: string): HTMLImageElement => {
  const image = new Image();
  image.src = src;
  return image;
};

function ToolIcon({tool}: {tool: ToolKey}) {
  const Icon = tool ? iconMap[tool] : HandIcon;
  return <Icon />;
}

export function ImageEditorWrapper({src, onCancel, onSubmit}: ImageEditorWrapperProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const resizeCanvas = useCallback(() => {
    if (!canvas) {
      return;
    }
    // fit canvas to window
    const {width, height} = getCanvasRenderSize(canvas, wrapperRef.current);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, [canvas]);

  const image = useMemo(() => srcToImage(src), [src]);
  const {selectedTool, setSelectedTool, selectedColor, setSelectedColor, getBlob} =
    useImageEditor({
      canvas,
      image,
      onLoad: resizeCanvas,
    });

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  return (
    <Container>
      <CanvasWrapper ref={wrapperRef}>
        <Canvas ref={setCanvas} />
      </CanvasWrapper>
      <Toolbar>
        <ToolbarGroup>
          <ColorInput background={selectedColor}>
            <input
              type="color"
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
            />
          </ColorInput>
        </ToolbarGroup>
        <ToolbarGroup>
          {Tools.map(tool => (
            <ToolButton
              key={tool}
              active={selectedTool === tool}
              onClick={() => setSelectedTool(tool)}
            >
              <ToolIcon tool={tool} />
            </ToolButton>
          ))}
        </ToolbarGroup>
        <ToolbarGroup>
          <CancelButton onClick={() => onCancel()}>Cancel</CancelButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <SubmitButton onClick={async () => onSubmit(await getBlob())}>
            Save
          </SubmitButton>
        </ToolbarGroup>
      </Toolbar>
    </Container>
  );
}
