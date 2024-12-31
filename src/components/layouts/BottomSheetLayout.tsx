import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { OVERFLOW_HIDDEN } from 'const/AttributeConst';
import { sendPopupEvent } from 'global/util/reactnative/StackRouter';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface BottomSheetLayoutProps {
  children: React.ReactNode;
  heightNum?: number;
  isOpen: boolean;
  threshold?: number;
  onClose: () => void;
  isExternalCloseFunc?: boolean;
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
  isFixed?: boolean;
  isAvaliScroll?: boolean;
  BottomSheetContainerStyle?: React.CSSProperties;
}

const BottomSheetLayout: React.FC<BottomSheetLayoutProps> = ({
  children,
  heightNum,
  isOpen,
  threshold = 70,
  onClose,
  isExternalCloseFunc,
  setIsExternalCloseFunc,
  isFixed = true,
  isAvaliScroll = true,
  BottomSheetContainerStyle,
}) => {
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(heightNum || 0);

  const [{ y }, api] = useSpring(() => ({ y: height }));

  const open = ({ canceled }: { canceled: boolean }) => {
    api.start({
      y: 0,
      immediate: false,
      config: canceled
        ? config.wobbly
        : { tension: 300, friction: 15, mass: 5, clamp: true },
    });
  };

  const close = () => {
    api.start({
      y: height,
      immediate: false,
      config: { tension: 300, friction: 15, mass: 5, clamp: true },
      onRest: () => {
        onClose(); // 애니메이션이 끝난 후 실행
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

      const y = window.scrollY;
      open({ canceled: false });

      if (!isFixed) return;
      sendPopupEvent(true);
      document.documentElement.style.overflow = OVERFLOW_HIDDEN;
      document.documentElement.style.touchAction = 'none';
      document.body.style.overflow = OVERFLOW_HIDDEN;
      document.body.style.touchAction = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.overscrollBehavior = 'none';
      //   root.style.overflow = OVERFLOW_HIDDEN;

      //   root.style.display = 'flow-root';
    } else {
      // react native로 popup 고정 제거 전달

      //   document.documentElement.style.overflow = 'auto';
      //   document.body.style.overflow = '';
      //   root.style.overflow = '';
      //   root.style.display = '';

      if (!isFixed) return;
      sendPopupEvent(false);
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overscrollBehavior = '';
      document.body.style.overscrollBehavior = '';
      close();
    }
  }, [isOpen]);

  useEffect(() => {
    const bottomSheetContainerRef = BottomSheetContainerRef.current;
    if (!bottomSheetContainerRef || heightNum !== undefined) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log(entry.contentRect.height);
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(bottomSheetContainerRef);

    return () => resizeObserver.disconnect();
  }, [BottomSheetContainerRef.current]);

  useEffect(() => {
    console.log('케인', isExternalCloseFunc);
    if (!isExternalCloseFunc) return;
    close();
    if (setIsExternalCloseFunc) {
      setIsExternalCloseFunc(false);
    }
  }, [isExternalCloseFunc]);

  return (
    <BottomSheetLayoutConatiner as={animated.div} style={{ display: display }}>
      <OverlayBackground
        as={animated.div}
        onClick={() => close()}
        style={bgStyle}
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
        <PopupScrollBar />
        <BottomSheetWrap $heightNum={height}>{children}</BottomSheetWrap>
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
  height: calc(100dvh + 100px);
  width: 100%;
  border-radius: 20px 20px 0 0;
  background: #fff;
  touch-action: none;
`;

const BottomSheetWrap = styled.div<{ $heightNum: number }>`
  height: ${(props) => props.$heightNum}px;
  display: flex;
  flex-flow: column;
`;

const PopupScrollBar = styled.div`
  height: 4px;
  width: 50px;
  z-index: 1000;
  border-radius: 3px;
  display: flex;
  margin: 7px auto 20px auto;
  background-color: ${({ theme }) => theme.grey.Grey2};
`;

export default BottomSheetLayout;
