import { animated, config, useSpring } from '@react-spring/web';
import { OVERFLOW_HIDDEN, POSITION_FIXED } from 'const/AttributeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { lock, unlock } from 'tua-body-scroll-lock';

interface ProfilePostDetailPopupProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  prevOnClose?: () => void;
  isExternalCloseFunc?: boolean;
  ProfilePostPopupStyle?: React.CSSProperties;
}

const ProfileDetailPopupLayout: React.FC<ProfilePostDetailPopupProps> = ({
  children,
  isOpen,
  onClose,
  prevOnClose,
  isExternalCloseFunc,
  ProfilePostPopupStyle,
}) => {
  const BottomSheetPopupRef = useRef<HTMLDivElement>(null);
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);
  const height = window.innerHeight;

  const [{ y }, api] = useSpring(() => ({ y: height }));

  const [scrollY, setScrollY] = useState<number>(0);

  const open = ({ canceled }: { canceled: boolean }) => {
    api.start({
      y: 0,
      immediate: false,
      config: canceled ? config.wobbly : config.default,
    });
  };

  const close = () => {
    if (prevOnClose) {
      prevOnClose();
    }
    api.start({
      y: height,
      immediate: false,
      config: { tension: 300, friction: 15, mass: 5, clamp: true },
      onRest: () => {
        onClose();
      },
    });

    funcRemoveParentFix();
  };

  const bgStyle = {
    background: y.to((value) => `rgba(255, 255, 255, ${1 - value / height})`),
  };

  const isRemoveFixRef = useRef<boolean>(false);
  const funcRemoveParentFix = () => {
    if (isRemoveFixRef.current) return;

    const userAgent = navigator.userAgent;

    // iPhone 또는 iOS인지 확인
    if (!/iPhone|iPad|iPod/.test(userAgent)) {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.documentElement.style.touchAction = 'auto';
      document.documentElement.style.overscrollBehavior = 'auto';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo({ top: scrollY });
    } else {
      unlock([], { useGlobalLockState: true });
    }

    isRemoveFixRef.current = true;
  };

  useEffect(() => {
    if (!isOpen) return;
    open({ canceled: false });

    if (!BottomSheetContainerRef.current || !BottomSheetPopupRef.current)
      return;

    // iPhone 또는 iOS인지 확인
    const userAgent = navigator.userAgent;

    if (!/iPhone|iPad|iPod/.test(userAgent)) {
      const y = window.scrollY;

      document.body.style.overflow = OVERFLOW_HIDDEN;
      document.body.style.position = POSITION_FIXED;
      document.documentElement.style.touchAction = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.width = '100%';
      document.body.style.left = '0px';
      document.body.style.right = '0px';

      setScrollY(y);
    } else {
      lock([BottomSheetContainerRef.current, BottomSheetPopupRef.current]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isExternalCloseFunc) return;
    close();
  }, [isExternalCloseFunc]);

  useEffect(() => {
    return () => {
      funcRemoveParentFix();
    };
  }, []);

  return (
    <BottomSheetLayoutConatiner
      ref={BottomSheetPopupRef}
      as={animated.div}
      style={ProfilePostPopupStyle}
    >
      <OverlayBackground as={animated.div} style={bgStyle} />
      <BottomSheetContainer ref={BottomSheetContainerRef}>
        {children}
      </BottomSheetContainer>
    </BottomSheetLayoutConatiner>
  );
};

const BottomSheetLayoutConatiner = styled.div`
  z-index: 500;
  width: 100%;
  height: 100%;
  display: contents;
`;

const OverlayBackground = styled.div`
  height: 100vh;
  position: fixed;
  overflow: hidden;
  z-index: 990;
  top: 0;
  left: 0;
  width: 100%;
  // height: 100%;
  background-color: white;
`;

const BottomSheetContainer = styled.div`
  z-index: 990;
  position: fixed;
  height: 100dvh;
  overflow-y: scroll;
  width: 100%;

  will-change: auto;
  user-select: none;
  overscroll-behavior: none;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  }
`;

// const BottomSheetWrap = styled.div`
//   height: 100dvh;
//   overflow-y: scroll;

//   user-select: none;
//   -webkit-user-drag: none;
//   touch-action: auto;
// `;

export default ProfileDetailPopupLayout;
