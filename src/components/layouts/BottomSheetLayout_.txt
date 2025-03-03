import { useDrag } from '@use-gesture/react';
import React, { ReactNode } from 'react';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';

interface PopupLayoutProps {
  children: ReactNode;
  setIsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  popupOverLayContainerStyle?: React.CSSProperties;
  popupContainerStyle?: React.CSSProperties;
  popupWrapStyle?: React.CSSProperties;
  popupContentWrapStyle?: React.CSSProperties;
  hasTransparentOverLay?: boolean;
}

const BottomSheetLayout_: React.FC<PopupLayoutProps> = ({
  children,
  setIsPopup,
  popupOverLayContainerStyle,
  popupContainerStyle,
  popupWrapStyle,
  popupContentWrapStyle,
  hasTransparentOverLay = false,
}) => {
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const closePopup = () => {
    api.start({ y: window.innerHeight, onRest: () => setIsPopup(false) });
  };
  const height = window.innerHeight;

  const bind = useDrag(
    ({ movement: [, my], velocity: [vx, vy], direction: [, dy], last }) => {
      const velocity = Math.sqrt(vx ** 2 + vy ** 2); // 벡터 크기 계산
      if (last) {
        if (velocity > 0.5 && dy > 0) {
          // 아래 방향으로 빠르게 드래그
          api.start({ y: height, immediate: false });
        } else {
          // 스프링 효과로 원래 위치로 돌아감
          api.start({ y: 0, immediate: false });
        }
      } else {
        // 드래그 중인 상태에서 y 위치를 업데이트
        api.start({ y: my, immediate: true });
      }
    },
    { axis: 'y' }, // Y축으로만 제한
  );

  return (
    <PopupLayoutOverlay
      style={popupOverLayContainerStyle}
      onClick={closePopup}
      $hasTransparentOverLay={hasTransparentOverLay}
    >
      <PopupContainer
        {...bind()}
        style={popupContainerStyle}
        as={animated.div}
        onClick={(e) => e.stopPropagation()}
      >
        <PopupWrap style={popupWrapStyle}>
          <PopupContentWrap style={popupContentWrapStyle}>
            {children}
          </PopupContentWrap>
        </PopupWrap>
      </PopupContainer>
    </PopupLayoutOverlay>
  );
};

const PopupLayoutOverlay = styled.div<{ $hasTransparentOverLay: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ $hasTransparentOverLay }) =>
    $hasTransparentOverLay ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)'};
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  width: 100%;
  height: 80%;
  background: white;
  border-radius: 15px 15px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  will-change: transform;
`;

const PopupWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PopupContentWrap = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export default BottomSheetLayout_;
