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
  background-color: rgba(240, 236, 243, 1);
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
  height: 42px;
  background-color: white;
  border: rgba(58, 17, 95, 0.14) 1px solid;
  border-radius: 10px;
  padding: 4px;
  overflow: hidden;
  gap: 4px;
  box-shadow: 0px 1px 2px 1px rgba(43, 34, 51, 0.04);
`;

const Toolbar = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0px;
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  flex-direction: row;
  justify-content: center;
`;

const FlexSpacer = styled.div`
  flex: 1;
`;

const ToolButton = styled.button<{active: boolean}>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background-color: white;
  color: rgba(43, 34, 51, 1);
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(43, 34, 51, 0.06);
  }
  ${({active}) =>
    active &&
    `
    background-color: rgba(108, 95, 199, 1) !important;\
    color: white;
  `}
`;

const CancelButton = styled.button`
  height: 40px;
  width: 84px;
  border: rgba(58, 17, 95, 0.14) 1px solid;
  background-color: #fff;
  color: rgba(43, 34, 51, 1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background-color: #eee;
  }
`;

const SubmitButton = styled.button`
  height: 40px;
  width: 84px;
  border: none;
  background-color: rgba(108, 95, 199, 1);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background-color: rgba(88, 74, 192, 1);
  }
`;

const ColorInput = styled.label`
  position: relative;
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  margin: 0;
  cursor: pointer;
  & input[type='color'] {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const ColorDisplay = styled.div<{color: string}>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  ${({color}) => `background-color: ${color};`}
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
        <CancelButton onClick={() => onCancel()}>Cancel</CancelButton>
        <FlexSpacer />
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
          <ColorInput>
            <ColorDisplay color={selectedColor} />
            <input
              type="color"
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
            />
          </ColorInput>
        </ToolbarGroup>
        <FlexSpacer />
        <SubmitButton onClick={async () => onSubmit(await getBlob())}>Save</SubmitButton>
      </Toolbar>
    </Container>
  );
}
