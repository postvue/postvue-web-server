import { ReactComponent as LightScrollXmoveButtonIcon } from 'assets/images/icon/svg/scrollx/LightScrollXMoveButtonIcon.svg';
import { ReactComponent as RightScrollXmoveButtonIcon } from 'assets/images/icon/svg/scrollx/RightScrollXMoveButtonIcon.svg';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MEDIA_MOBILE_MAX_WIDTH } from '../../../const/SystemAttrConst';

interface ScrollXMoveButtonProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  leftMoveNum: number;
  children: React.ReactNode;
  scrollContainerStyle?: React.CSSProperties;
  LeftScrollXButtonStyle?: React.CSSProperties;
  RightScrollXButtonStyle?: React.CSSProperties;
  ScrollLeftIcon?: React.ReactNode; // 왼쪽 버튼 아이콘
  ScrollRightIcon?: React.ReactNode; // 오른쪽 버튼 아이콘
}

const ScrollXMoveButtonContainer: React.FC<ScrollXMoveButtonProps> = ({
  scrollContainerRef,
  leftMoveNum,
  children,
  scrollContainerStyle,
  LeftScrollXButtonStyle,
  RightScrollXButtonStyle,
  ScrollLeftIcon,
  ScrollRightIcon,
}) => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  // 스크롤 상태를 확인하여 버튼 상태를 업데이트하는 함수
  const updateButtonVisibility = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      // 왼쪽 버튼: 스크롤이 맨 처음에 있는지 여부 확인
      setShowLeftButton(scrollLeft > 0);

      // 오른쪽 버튼: 스크롤이 맨 끝에 있는지 여부 확인
      setShowRightButton(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scrollLeft = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -leftMoveNum,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: leftMoveNum,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      setTimeout(() => {
        updateButtonVisibility();
      }, 0);

      if (scrollContainerRef.current) {
        scrollContainerRef.current.addEventListener(
          'scroll',
          updateButtonVisibility,
        );
      }

      return () => {
        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        if (scrollContainerRef.current) {
          scrollContainerRef.current.removeEventListener(
            'scroll',
            updateButtonVisibility,
          );
        }
      };
    }
  }, [scrollContainerRef.current]);

  return (
    <ScrollContainer style={scrollContainerStyle}>
      {children}
      <div>
        {showLeftButton && (
          <LeftScrollXButton
            onClick={scrollLeft}
            style={LeftScrollXButtonStyle}
          >
            {ScrollLeftIcon ? ScrollLeftIcon : <LightScrollXmoveButtonIcon />}
          </LeftScrollXButton>
        )}
        {showRightButton && (
          <RightScrollXButton
            onClick={scrollRight}
            style={RightScrollXButtonStyle}
          >
            {ScrollRightIcon ? ScrollRightIcon : <RightScrollXmoveButtonIcon />}
          </RightScrollXButton>
        )}
      </div>
    </ScrollContainer>
  );
};

const ScrollContainer = styled.div`
  position: relative;
`;

const ScrollXButton = styled.div`
  cursor: pointer;
  position: absolute;
  transform: translate(0, -50%);
  top: 50%;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none; /* 모바일 화면에서 버튼 숨기기 */
  }
`;

const LeftScrollXButton = styled(ScrollXButton)`
  left: 0px;
`;

const RightScrollXButton = styled(ScrollXButton)`
  right: 0px;
`;

export default ScrollXMoveButtonContainer;
