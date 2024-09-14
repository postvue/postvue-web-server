import React, { useState } from 'react';
import styled from 'styled-components';

interface LongPressToResizeButtonProps {
  LongPressToResizeButtonContainerStyle?: React.CSSProperties;
  resize?: number;
  children: React.ReactNode;
}

const LongPressToResizeButton: React.FC<LongPressToResizeButtonProps> = ({
  LongPressToResizeButtonContainerStyle,
  resize = 0.97,
  children,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <LongPressToResizeButtonContainer
      style={LongPressToResizeButtonContainerStyle}
      $isPressed={isPressed}
      $resize={resize}
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
}>`
  width: 100%;
  transition: transform 0.3s ease;
  transform: ${({ $isPressed, $resize }) =>
    $isPressed ? `scale(${$resize})` : `scale(1)`};
`;

export default LongPressToResizeButton;
