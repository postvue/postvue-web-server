import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface SliderLayoutProps {
  children: React.ReactNode;
  listLength: number;
  isDiplayDot?: false;
  dotSize?: number;
  DotStyle?: React.CSSProperties;
  actionFuncByNotScroll?: () => void;
}

const SliderLayout: React.FC<SliderLayoutProps> = ({
  children,
  listLength,
  isDiplayDot = true,
  dotSize = 8,
  DotStyle,
  actionFuncByNotScroll,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const SliderContainerRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState<number>(0);
  const slidesWrapperRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number) => {
    if (listLength <= 1 || !slidesWrapperRef.current) return;
    setIsDragging(true);
    setStartX(clientX);
    slidesWrapperRef.current.style.cursor = 'grabbing';
  };

  const handleMove = (clientX: number) => {
    if (listLength <= 1 || !slidesWrapperRef.current || !isDragging) return;
    const moveX = clientX - startX;
    setScrollX(moveX);
  };

  const handleEnd = (clientX: number) => {
    if (listLength <= 1 || !slidesWrapperRef.current) return;
    const moveX = clientX - startX;

    if (Math.abs(moveX) <= 5) {
      setIsDragging(false);
      setScrollX(0);
      slidesWrapperRef.current.style.cursor = 'grab';
      //   if (actionFuncByNotScroll) actionFuncByNotScroll();
      return;
    }

    if (scrollX > 50) {
      setCurrentIndex((prev) => (prev === 0 ? 0 : prev - 1));
    } else if (scrollX < -50) {
      setCurrentIndex((prev) =>
        prev === listLength - 1 ? listLength - 1 : prev + 1,
      );
    }
    setIsDragging(false);
    setScrollX(0);
    slidesWrapperRef.current.style.cursor = 'grab';
  };

  const updateSlideWidth = () => {
    const sliderContainerRef = SliderContainerRef.current;
    if (!sliderContainerRef) return;
    setSlideWidth(sliderContainerRef.offsetWidth);
  };

  useEffect(() => {
    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);

    return () => {
      window.removeEventListener('resize', updateSlideWidth);
    };
  }, []);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    handleMove(touch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    handleEnd(touch.clientX);
  };

  // 마우스 이벤트 핸들러
  const handleMouseDown = (event: React.MouseEvent) =>
    handleStart(event.clientX);
  const handleMouseMove = (event: React.MouseEvent) =>
    handleMove(event.clientX);
  const handleMouseUp = (event: React.MouseEvent) => handleEnd(event.clientX);

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setScrollX(0);
      if (slidesWrapperRef.current)
        slidesWrapperRef.current.style.cursor = 'grab';
    }
  };

  return (
    <SliderContainer
      ref={SliderContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <SlidesWrapper
        translateX={-currentIndex * slideWidth + scrollX * 1.5}
        ref={slidesWrapperRef}
      >
        {children}
      </SlidesWrapper>
      {isDiplayDot && listLength > 1 && (
        <DotsWrapper>
          {Array.from({ length: listLength }).map((_, index) => (
            <Dot
              key={index}
              isActive={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
              style={DotStyle}
              $size={dotSize}
            />
          ))}
        </DotsWrapper>
      )}
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  touch-action: pan-y;
`;

const SlidesWrapper = styled.div<{ translateX: number }>`
  display: flex;
  transition: transform 0.3s ease-out;
  transition-delay: 0ms;

  transform: translateX(${(props) => props.translateX}px);
`;

const DotsWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 17px;
  left: 50%;
  transform: translate(-50%, 0);
`;

const Dot = styled.div<{ isActive: boolean; $size: number }>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  margin: 0 5px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.isActive ? theme.grey.Grey5 : theme.grey.Grey2};
  filter: opacity(0.8);
  cursor: pointer;

  &:hover {
    filter: brightness(0.7);
  }
`;

export default SliderLayout;
