import { animated, config, useSpring } from '@react-spring/web';
import { sendPopupEvent } from 'global/util/reactnative/nativeRouter';
import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import React, { useEffect, useRef, useState } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { isFixScrollToPostDetailPopupAtom } from 'states/PostAtom';
import styled from 'styled-components';

interface BottomSheetNotScrollLayoutProps {
  children: React.ReactNode;
  heightNum?: number;
  isOpen: boolean;
  onClose: () => void;
  hasCloseFunc?: boolean;
  isExternalCloseFunc?: boolean;
  BottomSheetContainerStyle?: React.CSSProperties;
}

const BottomSheetNotScrollLayout: React.FC<BottomSheetNotScrollLayoutProps> = ({
  children,
  heightNum,
  isOpen,
  hasCloseFunc = true,
  onClose,
  isExternalCloseFunc,
  BottomSheetContainerStyle,
}) => {
  const setIsFixScrollToPostDetailPopup = useSetRecoilState(
    isFixScrollToPostDetailPopupAtom,
  );
  const resetIsFixScrollToPostDetailPopup = useResetRecoilState(
    isFixScrollToPostDetailPopupAtom,
  );

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

  useBodyAdaptProps([
    { key: 'overflow', value: 'hidden' },
    { key: 'touch-action', value: 'none' },
    { key: 'overscroll-behavior', value: 'none' },
  ]);

  const isFixBody = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    sendPopupEvent(true);
  };

  const isRemoveFixRef = useRef<boolean>(false);
  const removeFixBody = () => {
    if (isRemoveFixRef.current) return;

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
    <BottomSheetNotScrollLayoutConatiner
      as={animated.div}
      style={{ display: display }}
    >
      <OverlayBackground
        as={animated.div}
        onClick={() => {
          hasCloseFunc && close();
        }}
        style={bgStyle}
      />
      <BottomSheetContainer
        ref={BottomSheetContainerRef}
        as={animated.div}
        style={{
          ...{ bottom: `calc(-100dvh + ${height - 100}px)`, y },
          ...BottomSheetContainerStyle,
        }}
      >
        <PopupScrollNotBar />
        <BottomSheetWrap ref={BottomSheetScrollRef} $heightNum={height}>
          {children}
        </BottomSheetWrap>
      </BottomSheetContainer>
    </BottomSheetNotScrollLayoutConatiner>
  );
};

const BottomSheetNotScrollLayoutConatiner = styled.div`
  overflow: hidden;
  position: relative;
  z-index: 2000;
  width: 100%;
  height: 100%;
`;

const OverlayBackground = styled.div`
  height: 100dvh;
  position: fixed;
  right: 0;
  left: 0;

  z-index: 2000;
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
  z-index: 2010;
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

  overflow-y: scroll;
  overscroll-behavior: none;
  touch-action: pan-y;
  transform: none;
  user-select: none;
  will-change: auto;
`;

const PopupScrollNotBar = styled.div`
  height: 4px;
  width: 50px;
  z-index: 1000;
  border-radius: 3px;
  display: flex;
  margin: 7px auto 20px auto;
`;

export default BottomSheetNotScrollLayout;
