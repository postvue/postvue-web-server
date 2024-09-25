import React, { useState } from 'react';
import styled from 'styled-components';

interface LongPressToResizeButtonProps {
  LongPressToResizeButtonContainerStyle?: React.CSSProperties;
  resize?: number;
  resizeSpeedRate?: number;
  children: React.ReactNode;
}

const LongPressToResizeButton: React.FC<LongPressToResizeButtonProps> = ({
  LongPressToResizeButtonContainerStyle,
  resize = 0.97,
  resizeSpeedRate = 0.3,
  children,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <LongPressToResizeButtonContainer
      style={LongPressToResizeButtonContainerStyle}
      $isPressed={isPressed}
      $resize={resize}
      $resizeSpeedRate={resizeSpeedRate}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
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
  display: flex;
  // margin: auto 0;
`;

export default LongPressToResizeButton;
