import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { sendPopupEvent } from 'global/util/reactnative/nativeRouter';
import React, { useEffect, useRef, useState } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { isFixScrollToPostDetailPopupAtom } from 'states/PostAtom';
import styled from 'styled-components';
import { lock, unlock } from 'tua-body-scroll-lock';

interface BottomSheetLayoutProps {
  children: React.ReactNode;
  heightNum?: number;
  isOpen: boolean;
  threshold?: number;
  onClose: () => void;
  isExternalCloseFunc?: boolean;
  isAvaliScroll?: boolean;
  OverlaySheetStyle?: React.CSSProperties;
  BottomSheetContainerStyle?: React.CSSProperties;
  isScrollBar?: boolean;
}

const BottomSheetLayout: React.FC<BottomSheetLayoutProps> = ({
  children,
  heightNum,
  isOpen,
  threshold = 70,
  onClose,
  isExternalCloseFunc,
  isAvaliScroll = true,
  OverlaySheetStyle,
  BottomSheetContainerStyle,
  isScrollBar = true,
}) => {
  const setIsFixScrollToPostDetailPopup = useSetRecoilState(
    isFixScrollToPostDetailPopupAtom,
  );
  const resetIsFixScrollToPostDetailPopup = useResetRecoilState(
    isFixScrollToPostDetailPopupAtom,
  );

  const BottomSnapSheetLayoutRef = useRef<HTMLDivElement>(null);
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);

  const BottomSheetScrollRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(heightNum || 0);

  const [{ y }, api] = useSpring(() => ({ y: height }));

  const open = ({ canceled }: { canceled: boolean }) => {
    api.start({
      y: 0,
      immediate: false,
      config: canceled ? config.wobbly : config.default,
    });
    setIsFixScrollToPostDetailPopup(true);
  };

  const isFixBody = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    lock([BottomSnapSheetLayoutRef.current!, BottomSheetScrollRef.current!]);

    sendPopupEvent(true);
  };

  const isRemoveFixRef = useRef<boolean>(false);
  const removeFixBody = () => {
    if (isRemoveFixRef.current) return;
    unlock([], { useGlobalLockState: true });
    sendPopupEvent(false);
    isRemoveFixRef.current = true;
  };

  const close = () => {
    removeFixBody();

    api.start({
      y: height,
      immediate: false,
      config: { tension: 300, friction: 15, mass: 5, clamp: true },
      onRest: () => {
        onClose(); // 애니메이션이 끝난 후 실행
        resetIsFixScrollToPostDetailPopup();
      },
    });
  };

  const bind = useDrag(
    ({
      last,
      velocity: [, vy],
      direction: [, dy],
      offset: [, oy],
      cancel,
      canceled,
    }) => {
      if (oy < -threshold || !isAvaliScroll) {
        cancel();
        return;
      }

      if (last) {
        oy > height * 0.5 || (vy > 0.5 && dy > 0)
          ? close()
          : open({ canceled: !!canceled });
      } else {
        if (oy < 0) return;
        api.start({ y: oy, immediate: true });
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    },
  );

  const display = y.to((py) => (py < height ? 'contents' : 'none'));

  const bgStyle = {
    opacity: y.to([0, height], [0.5, 0], 'clamp'),
  };

  useEffect(() => {
    if (isOpen) {
      // react native로 popup 고정 전달

      open({ canceled: false });

      isFixBody();
    } else {
      close();
    }
  }, [isOpen]);

  useEffect(() => {
    const bottomSheetContainerRef = BottomSheetContainerRef.current;
    if (!bottomSheetContainerRef || heightNum !== undefined) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(bottomSheetContainerRef);

    return () => resizeObserver.disconnect();
  }, [BottomSheetContainerRef.current]);

  useEffect(() => {
    if (!isExternalCloseFunc) return;
    close();
  }, [isExternalCloseFunc]);

  useEffect(() => {
    return () => {
      close();
    };
  }, []);

  return (
    <BottomSheetLayoutConatiner
      as={animated.div}
      style={{ display: display }}
      ref={BottomSnapSheetLayoutRef}
    >
      <OverlayBackground
        as={animated.div}
        onClick={() => close()}
        style={{ ...bgStyle, ...OverlaySheetStyle }}
      />
      <BottomSheetContainer
        ref={BottomSheetContainerRef}
        as={animated.div}
        {...bind()}
        style={{
          ...{ bottom: `calc(-100dvh + ${height - 100}px)`, y },
          ...BottomSheetContainerStyle,
        }}
      >
        <PopupScrollWrap>
          {isScrollBar ? <PopupScrollBar /> : <PopupScrollNotBar />}
        </PopupScrollWrap>
        <BottomSheetWrap
          ref={BottomSheetScrollRef}
          $heightNum={height - ScrollBarHeight}
        >
          {children}
        </BottomSheetWrap>
      </BottomSheetContainer>
    </BottomSheetLayoutConatiner>
  );
};

const BottomSheetLayoutConatiner = styled.div`
  overflow: hidden;
  position: relative;
  z-index: 2000;
  width: 100%;
  height: 100%;
`;

const OverlayBackground = styled.div`
  height: 100dvh;
  position: fixed;

  z-index: 1500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  background-color: black;
`;

const BottomSheetContainer = styled.div`
  z-index: 1590;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  position: fixed;
  right: 0;
  left: 0;
  height: calc(100dvh + 100px);
  width: 100%;
  border-radius: 20px 20px 0 0;
  background: #fff;
  touch-action: none;
`;

const BottomSheetWrap = styled.div<{ $heightNum: number }>`
  height: ${(props) => props.$heightNum}px;

  // overflow-y: hidden;
  overscroll-behavior: none;
  touch-action: pan-y;
  transform: none;
  user-select: none;
  will-change: auto;
`;

const ScrollBarHeight = 30;

const PopupScrollWrap = styled.div`
  height: ${ScrollBarHeight}px;
  display: flex;
`;

const PopupScrollNotBar = styled.div`
  height: 4px;
  width: 50px;
  z-index: 1000;
  border-radius: 3px;
  display: flex;
  margin: auto;
`;

const PopupScrollBar = styled(PopupScrollNotBar)`
  background-color: ${({ theme }) => theme.grey.Grey2};
`;

export default BottomSheetLayout;
