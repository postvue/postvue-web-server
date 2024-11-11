import React, { useRef, useState } from 'react';
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

  const pressTimerRef = useRef<number | null>(null);
  const handleMouseStart = (): void => {
    // 배경색을 조금 어둡게 변경

    // 꾹 눌렀을 때 타이머 시작
    setIsPressed(true);
    if (!onDownFunc) return;
    pressTimerRef.current = window.setTimeout(() => {
      onDownFunc();
    }, resizeSpeedRate * 1000); //  동안 꾹 눌렀을 때 감지
  };
  const handleMouseEnd = (): void => {
    // 버튼에서 손을 떼면 타이머 취소 및 색상 복구
    setIsPressed(false);
    if (!onDownFunc) return;
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

  // @REFER: 데스크탑에서 특정 사진, 화면 깨지는 문제 있음
  // display: flex;
  // margin: auto 0;
`;

export default LongPressToResizeButton;
