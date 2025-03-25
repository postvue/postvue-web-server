import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface LongPressToResizeButtonProps {
  LongPressToResizeButtonContainerStyle?: React.CSSProperties;
  resize?: number;
  resizeSpeedRate?: number;
  children: React.ReactNode;
  onDownFunc?: () => void;
}

const LongPressToResizeButton: React.FC<LongPressToResizeButtonProps> = ({
  LongPressToResizeButtonContainerStyle,
  resize = 0.97,
  resizeSpeedRate = 0.3,
  children,
  onDownFunc,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchMove = () => {
    setIsScrolling(true);
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 500); // 스크롤 멈춤 감지 딜레이
  };

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  const handleMouseStart = (): void => {
    if (isScrolling) return; // 스크롤 중이면 실행 방지

    setIsPressed(true);
    if (!onDownFunc) return;
    pressTimerRef.current = setTimeout(() => {
      onDownFunc();
    }, resizeSpeedRate * 1000);
  };

  const handleMouseEnd = (): void => {
    setIsPressed(false);
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  return (
    <LongPressToResizeButtonContainer
      style={LongPressToResizeButtonContainerStyle}
      $isPressed={isPressed}
      $resize={resize}
      $resizeSpeedRate={resizeSpeedRate}
      onMouseDown={handleMouseStart}
      onMouseUp={handleMouseEnd}
      onMouseLeave={handleMouseEnd}
      onTouchStart={handleMouseStart}
      onTouchEnd={handleMouseEnd}
      onTouchMove={handleTouchMove}
    >
      {children}
    </LongPressToResizeButtonContainer>
  );
};

const LongPressToResizeButtonContainer = styled.div<{
  $isPressed: boolean;
  $resize: number;
  $resizeSpeedRate: number;
}>`
  width: 100%;
  transition: transform ${(props) => props.$resizeSpeedRate}s ease;
  transform: ${({ $isPressed, $resize }) =>
    $isPressed ? `scale(${$resize})` : `scale(1)`};
`;

export default LongPressToResizeButton;
