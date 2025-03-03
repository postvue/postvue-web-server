import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { ReactComponent as PostContentZoomExitButtonIcon } from 'assets/images/icon/svg/PostContentZoomExitButtonIcon.svg';
import { sendPopupEvent } from 'global/util/reactnative/nativeRouter';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { lock, unlock } from 'tua-body-scroll-lock';

interface PostContentZoomMobilePopupProps {
  children: React.ReactNode;
  isOpen: boolean;
  threshold?: number;
  onClose: () => void;
  isExternalCloseFunc: boolean;
  setIsExternalCloseFunc: React.Dispatch<React.SetStateAction<boolean>>;
  currentIndex: number;
  contentLength: number;
}

const PostContentZoomMobilePopup: React.FC<PostContentZoomMobilePopupProps> = ({
  children,
  isOpen,
  threshold = 50,
  onClose,
  isExternalCloseFunc,
  setIsExternalCloseFunc,
  currentIndex,
  contentLength,
}) => {
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);
  const height = window.innerHeight;

  const [{ y }, api] = useSpring(() => ({ y: height }));

  const open = ({ canceled }: { canceled: boolean }) => {
    api.start({
      y: 0,
      immediate: false,
      config: canceled ? config.wobbly : config.default,
    });
  };

  const close = () => {
    api.start({
      y: height,
      immediate: false,
      config: { tension: 300, friction: 15, mass: 5, clamp: true },
      onRest: () => {
        removeFixBody();
        onClose(); // 애니메이션이 끝난 후 실행
      },
    });
  };

  const bind = useDrag(
    ({
      last,
      velocity: [, vy],
      direction: [, dy],
      offset: [ox, oy],
      cancel,
      canceled,
    }) => {
      if (
        oy / Math.abs(ox) <= 7 / 6 ||
        Math.abs(ox) > oy ||
        Math.abs(ox) >= threshold ||
        oy < -threshold
      ) {
        cancel();
      }

      if (last) {
        oy > 80 || (vy > 1.6 && dy > 0)
          ? close()
          : open({ canceled: !!canceled });
      } else {
        if (oy < 0 || oy / Math.abs(ox) <= 7 / 6) return;
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

  const visibility = y.to((py) => (py < height ? 'visible' : 'hidden'));
  const display = y.to((py) => (py < height ? '' : 'none'));

  const bgStyle = {
    opacity: y.to([0, height], [0.92, 0], 'clamp'),
  };

  const isFixBody = () => {
    // if (!isFixed) return;
    // document.documentElement.style.overflow = OVERFLOW_HIDDEN;
    // document.documentElement.style.touchAction = 'none';
    // document.body.style.overflow = OVERFLOW_HIDDEN;
    // document.body.style.touchAction = 'none';
    // document.documentElement.style.overscrollBehavior = 'none';
    // document.body.style.overscrollBehavior = 'none';
    sendPopupEvent(true);
    if (!BottomSheetContainerRef.current) return;
    lock([BottomSheetContainerRef.current]);
  };

  const isCloseRef = useRef<boolean>(false);
  const removeFixBody = () => {
    // if (!isFixed) return;
    // document.documentElement.style.overflow = '';
    // document.documentElement.style.touchAction = '';
    // document.body.style.overflow = '';
    // document.body.style.touchAction = '';
    // document.documentElement.style.overscrollBehavior = '';
    // document.body.style.overscrollBehavior = '';

    if (isCloseRef.current) return;

    sendPopupEvent(false);
    unlock([], { useGlobalLockState: true });
    isCloseRef.current = true;
  };

  useEffect(() => {
    if (isOpen) {
      open({ canceled: false });

      isFixBody();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      removeFixBody();
    };
  }, []);

  useEffect(() => {
    if (!isExternalCloseFunc) return;
    close();
    if (setIsExternalCloseFunc) {
      setIsExternalCloseFunc(false);
    }
  }, [isExternalCloseFunc]);

  return (
    <BottomSheetLayoutConatiner
      className={'post-zoom-popup'}
      as={animated.div}
      style={{ visibility: visibility, display: display }}
    >
      <OverlayBackground
        as={animated.div}
        onClick={() => close()}
        style={bgStyle}
      />
      {contentLength > 1 && (
        <CurrentSlidePositionWrap as={animated.div} style={bgStyle}>
          <CurrentSlidePosition>
            {currentIndex + 1}/{contentLength}
          </CurrentSlidePosition>
        </CurrentSlidePositionWrap>
      )}

      <PostZoomExitButtonWrap
        as={animated.div}
        style={bgStyle}
        onClick={() => {
          setIsExternalCloseFunc(true);
        }}
      >
        <PostContentZoomExitButtonIcon />
      </PostZoomExitButtonWrap>
      <BottomSheetContainer
        ref={BottomSheetContainerRef}
        as={animated.div}
        {...bind()}
        style={{ bottom: `calc(-100dvh + ${height}px)`, y }}
      >
        {children}
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
  z-index: 1400;
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
  z-index: 1490;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  position: fixed;
  height: calc(100dvh);
  width: 100%;
  touch-action: none;
`;

const CurrentSlidePositionWrap = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1500;
`;

const CurrentSlidePosition = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey8};
  color: ${({ theme }) => theme.mainColor.White};
  display: inline-block;
  padding: 5px 8px;
  padding: 3px 7px;
  border-radius: 15px;
  font: ${({ theme }) => theme.fontSizes.Body1};
`;

const PostZoomExitButtonWrap = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  margin: 10px 10px 0 0;
  z-index: 1500;
  cursor: pointer;
  padding-top: env(safe-area-inset-top);
`;

export default PostContentZoomMobilePopup;
