import React, { ReactNode, useRef, useState } from 'react';
import styled from 'styled-components';

interface LongPressReactionProps {
  children: ReactNode;
  onDownService: () => void;
}

const LongPressReaction: React.FC<LongPressReactionProps> = ({
  children,
  onDownService,
}) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const pressTimerRef = useRef<number | null>(null);
  const handleMouseStart = (): void => {
    // 배경색을 조금 어둡게 변경

    // 꾹 눌렀을 때 타이머 시작
    setIsPressed(true);
    pressTimerRef.current = window.setTimeout(() => {
      onDownService();
    }, 500); // 1000ms (1초) 동안 꾹 눌렀을 때 감지
  };
  const handleMouseEnd = (): void => {
    // 버튼에서 손을 떼면 타이머 취소 및 색상 복구
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsPressed(false);
  };

  return (
    <LongPressReactionContainer
      isPressed={isPressed}
      onMouseDown={handleMouseStart}
      onMouseUp={handleMouseEnd}
      onMouseLeave={handleMouseEnd}
      onTouchStart={handleMouseStart}
      onTouchEnd={handleMouseEnd}
    >
      {children}
    </LongPressReactionContainer>
  );
};

const LongPressReactionContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isPressed',
})<{ isPressed: boolean }>`
  filter: ${(props) => (props.isPressed ? 'brightness(0.7)' : 'brightness(1)')};
  cursor: pointer;
`;

export default LongPressReaction;
