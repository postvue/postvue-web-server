import React, { useState } from 'react';
import styled from 'styled-components';

interface HorizontalGrabScrollContainerProps {
  horiontalContainerRef: React.RefObject<HTMLDivElement>;
  HorizontalGrabScrollContainerStyle?: React.CSSProperties;
  children: React.ReactNode;
}

const HorizontalGrabScrollContainer: React.FC<
  HorizontalGrabScrollContainerProps
> = ({
  horiontalContainerRef,
  HorizontalGrabScrollContainerStyle,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = horiontalContainerRef.current;
    if (!container) return;

    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const container = horiontalContainerRef.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const walk = x - startX; // 드래그 거리 계산
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent) => {
    setIsDragging(false);
  };
  return (
    <HorizontalGrabScrollContainerWrap
      ref={horiontalContainerRef}
      $isDragging={isDragging}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      style={HorizontalGrabScrollContainerStyle}
    >
      {children}
    </HorizontalGrabScrollContainerWrap>
  );
};

const HorizontalGrabScrollContainerWrap = styled.div<{ $isDragging: boolean }>`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
  user-select: none;
  cursor: ${(props) => (props.$isDragging ? 'grabbing' : 'grab')};

  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

export default HorizontalGrabScrollContainer;
