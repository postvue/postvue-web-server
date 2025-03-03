import { animated, config, useSpring } from '@react-spring/web';
import { sendPopupEvent } from 'global/util/reactnative/nativeRouter';
import React, { useEffect, useRef, useState } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { isFixScrollToPostDetailPopupAtom } from 'states/PostAtom';
import styled from 'styled-components';
import { lock, unlock } from 'tua-body-scroll-lock';

interface BottomFullScreenSheetLayoutProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isExternalCloseFunc?: boolean;
  isImmediate?: boolean;
  BottomSheetContainerStyle?: React.CSSProperties;
  bottomSheetHeaderNode?: React.ReactNode;
  BottomSheetBottomNode?: React.ReactNode;
}

const BottomFullScreenSheetLayout: React.FC<
  BottomFullScreenSheetLayoutProps
> = ({
  children,
  isOpen,
  onClose,
  isImmediate = false,
  isExternalCloseFunc,
  BottomSheetContainerStyle,
  bottomSheetHeaderNode,
  BottomSheetBottomNode,
}) => {
  const setIsFixScrollToPostDetailPopup = useSetRecoilState(
    isFixScrollToPostDetailPopupAtom,
  );
  const resetIsFixScrollToPostDetailPopup = useResetRecoilState(
    isFixScrollToPostDetailPopupAtom,
  );
  const height = window.innerHeight;

  const [{ y }, api] = useSpring(() => ({ y: height }));

  const BottomFullScreenSheetRef = useRef<HTMLDivElement>(null);
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);
  const BottomScrollSheetRef = useRef<HTMLDivElement>(null);
  const BottomSheetHeaderRef = useRef<HTMLDivElement>(null);
  const BottomSheetBottomRef = useRef<HTMLDivElement>(null);

  const open = ({ canceled }: { canceled: boolean }) => {
    api.start({
      y: 0,
      immediate: isImmediate,
      config: config.default,
    });
    setIsFixScrollToPostDetailPopup(true);
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

  const display = y.to((py) => (py < height ? 'contents' : 'none'));

  const bgStyle = {
    opacity: y.to([0, height], [1, 0], 'clamp'),
  };

  const isFixBody = () => {
    if (!BottomFullScreenSheetRef.current || !BottomScrollSheetRef.current)
      return;
    sendPopupEvent(true);

    lock([BottomFullScreenSheetRef.current, BottomScrollSheetRef.current]);
  };

  const removeFixBody = () => {
    sendPopupEvent(false);
    unlock([], {
      useGlobalLockState: true,
    });
  };

  useEffect(() => {
    if (isOpen) {
      open({ canceled: false });
      isFixBody();
    } else {
      close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isExternalCloseFunc) return;
    close();
  }, [isExternalCloseFunc]);

  useEffect(() => {
    return () => {
      close();
    };
  }, []);

  const [bottomHeight, setBottomHeight] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  useEffect(() => {
    const headerElement = BottomSheetHeaderRef.current;
    if (!headerElement) return;

    const observer = new ResizeObserver(() => {
      setHeaderHeight(headerElement.clientHeight);
    });

    observer.observe(headerElement);

    return () => observer.disconnect();
  }, [bottomSheetHeaderNode]);
  useEffect(() => {
    const bottomElement = BottomSheetBottomRef.current;
    if (!bottomElement) return;

    const observer = new ResizeObserver(() => {
      setBottomHeight(bottomElement.clientHeight);
    });

    observer.observe(bottomElement);

    return () => observer.disconnect();
  }, [BottomSheetBottomNode]);

  return (
    <BottomFullScreenSheetLayoutConatiner
      ref={BottomFullScreenSheetRef}
      as={animated.div}
      style={{ display: display }}
    >
      <OverlayBackground as={animated.div} style={bgStyle} />
      <BottomSheetContainer
        ref={BottomSheetContainerRef}
        as={animated.div}
        style={{
          ...{ bottom: `calc(-100dvh + ${height - 100}px)`, y },

          ...BottomSheetContainerStyle,
        }}
      >
        <BottomSheetHeader ref={BottomSheetHeaderRef}>
          {bottomSheetHeaderNode}
        </BottomSheetHeader>
        <BottomSheetWrap
          ref={BottomScrollSheetRef}
          $heightNum={height - headerHeight - bottomHeight}
        >
          {children}
        </BottomSheetWrap>
        <BottomSheetBottomWrap ref={BottomSheetBottomRef}>
          {BottomSheetBottomNode}
        </BottomSheetBottomWrap>
      </BottomSheetContainer>
    </BottomFullScreenSheetLayoutConatiner>
  );
};

const BottomFullScreenSheetLayoutConatiner = styled.div`
  overflow: hidden;
  position: relative;
  z-index: 3000;
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
  background-color: white;
`;

const BottomSheetContainer = styled.div`
  z-index: 1590;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  position: fixed;
  height: calc(100dvh + 100px);
  width: 100%;
  background: #fff;
  touch-action: none;
`;

const BottomSheetWrap = styled.div<{ $heightNum: number }>`
  height: ${(props) => props.$heightNum}px;
  overflow: scroll;
  display: flex;
  flex-flow: column;
`;

const BottomSheetHeader = styled.div``;
const BottomSheetBottomWrap = styled.div``;

export default BottomFullScreenSheetLayout;
