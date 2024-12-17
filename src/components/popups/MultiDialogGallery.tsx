import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// 다이얼로그 스타일
const DialogWrapper = styled.div<{ isActive: boolean }>`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
`;

// 다이얼로그 내용 스타일
const DialogContent = styled.div`
  position: relative;
  background-color: white;
  width: 80%;
  height: 80%;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

// 슬라이드 이미지 스타일
const SlideImage = styled.div<{ slideOffset: number }>`
  display: flex;
  transform: translateX(${(props) => props.slideOffset}px);
  transition: transform 0.3s ease;
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

// 스크롤을 감지하여 다이얼로그 비활성화
const MultiDialogGallery: React.FC = () => {
  const [isDialogActive, setDialogActive] = useState(true);
  const [slideOffset, setSlideOffset] = useState(0);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    // 스크롤 이벤트 리스너 추가
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // 스크롤 100px 이상일 경우 다이얼로그 비활성화
        setDialogActive(false);
      } else {
        setDialogActive(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSlide = (direction: 'left' | 'right') => {
    const slideWidth = 300; // 슬라이드 한 번에 이동할 너비
    setSlideOffset(
      (prev) => prev + (direction === 'right' ? slideWidth : -slideWidth),
    );
  };

  return (
    <DialogWrapper isActive={isDialogActive}>
      <DialogContent>
        {/* 이미지 슬라이드 */}
        <SlideImage slideOffset={slideOffset}>
          <img src="https://via.placeholder.com/800x600" alt="Image 1" />
          <img src="https://via.placeholder.com/800x600" alt="Image 2" />
          <img src="https://via.placeholder.com/800x600" alt="Image 3" />
        </SlideImage>

        {/* 슬라이드 버튼 */}
        <button onClick={() => handleSlide('left')}>슬라이드 왼쪽</button>
        <button onClick={() => handleSlide('right')}>슬라이드 오른쪽</button>
      </DialogContent>
    </DialogWrapper>
  );
};

export default MultiDialogGallery;
