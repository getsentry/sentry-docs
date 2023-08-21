import React, {useEffect} from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  padding-top: 8px;
  left: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
  transition-delay: 0.5s;
  transform: translateY(0);
  &[data-hide='true'] {
    transition-delay: 0s;
    transform: translateY(-100%);
  }
`;

const Content = styled.div`
  background-color: #231c3d;
  border: 1px solid #ccc;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  padding: 6px 24px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.2);
`;

export function ScreenshotEditorHelp({hide}: {hide: boolean}) {
  const [isHidden, setIsHidden] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialBoundingRect = contentRef.current!.getBoundingClientRect();
    const handleMouseMove = (e: MouseEvent) => {
      const {clientX, clientY} = e;
      const {left, bottom, right} = initialBoundingRect;
      const threshold = 50;
      const isNearContent =
        clientX > left - threshold &&
        clientX < right + threshold &&
        clientY < bottom + threshold;
      if (isNearContent) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Wrapper data-hide={isHidden || hide}>
      <Content ref={contentRef}>
        {'Mark the problem on the sceen ("Enter" to skip)'}
      </Content>
    </Wrapper>
  );
}
