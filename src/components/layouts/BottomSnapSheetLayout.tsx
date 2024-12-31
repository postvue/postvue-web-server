import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { OVERFLOW_HIDDEN } from 'const/AttributeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { sendPopupEvent } from 'global/util/reactnative/StackRouter';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface BottomSnapSheetLayoutProps {
  children: React.ReactNode;
  heightNum?: number;
  isOpen: boolean;

  onClose: () => void;
  bottomSheetHeader?: React.ReactNode;
  BottomSheetBottom?: React.ReactNode;
  touchHeaderHeightNum?: number;
  isExternalCloseFunc?: boolean;
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
  isFixed?: boolean;
}

const BottomSnapSheetLayout: React.FC<BottomSnapSheetLayoutProps> = ({
  children,
  heightNum,
  isOpen,
  onClose,
  bottomSheetHeader,
  BottomSheetBottom,
  touchHeaderHeightNum = 30,
  isExternalCloseFunc,
  setIsExternalCloseFunc,
  isFixed = true,
}) => {
  const BottomSnapSheetLayoutRef = useRef<HTMLDivElement>(null);
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(heightNum || 0);
  const [scrollY, setScrollY] = useState<number>(0);
  const ScrollRef = useRef<HTMLDivElement>(null);
  const BottomSheetHeaderRef = useRef<HTMLDivElement>(null);
  const BottomSheetBottomRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [bottomHeight, setBottomHeight] = useState<number>(0);

  const [{ y }, api] = useSpring(() => ({ y: height }));
  const [{ sheetY }, sheetApi] = useSpring(() => ({ sheetY: height }));

  const open = ({ canceled }: { canceled: boolean }) => {
    api.start({
      y: 0,
      immediate: false,
      config: canceled ? config.wobbly : config.default,
    });
  };

  const close = () => {
    if (BottomSnapSheetLayoutRef.current) {
      BottomSnapSheetLayoutRef.current.style.overflow = OVERFLOW_HIDDEN;
      BottomSnapSheetLayoutRef.current.style.touchAction = 'none';
      BottomSnapSheetLayoutRef.current.style.overscrollBehavior = 'none';
    }

    api.start({
      y: height,
      immediate: false,
      config: config.stiff,
      onRest: () => {
        console.log('헤헤헤헤');
        removeFixedByClose();
        onClose(); // 애니메이션이 끝난 후 실행
      },
    });
  };

  const binds = (
    oy: number,
    dy: number,
    vy: number,
    last: boolean,
    cancel: () => void,
    canceled: boolean,
  ) => {
    if (oy <= 0) cancel();
    const clampedY = Math.max(0, Math.min(oy, height)); // 위치 클램핑
    if (last) {
      // 드래그 종료 시 스냅 동작
      oy > 5 || (vy > 0.25 && dy > 0) ? close() : open({ canceled: canceled });
    } else {
      // 드래그 중 실시간 위치 업데이트
      api.start({ y: clampedY, immediate: true });
    }
  };

  // const bind = useDrag(
  //   ({
  //     last,
  //     velocity: [, vy],
  //     direction: [, dy],
  //     offset: [, oy],
  //     cancel,
  //     canceled,
  //   }) => {
  //     const scrollRef = ScrollRef.current;

  //     // 내부 스크롤이 존재하고 스크롤이 가능하다면, Bottom Sheet 드래그 중지
  //     if (scrollRef && scrollRef.scrollTop > 0) {
  //       cancel?.();
  //       return;
  //     }

  //     console.log('캐스퍼');
  //     binds(oy, dy, vy, last, !!canceled);
  //   },
  //   {
  //     from: () => [0, y.get()],
  //     filterTaps: true,
  //     bounds: { top: 0 },
  //     rubberband: true,
  //   },
  // );

  const [test, setTest] = useState<string>('');

  const scrollBarbind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], offset: [, oy] }) => {
      const clampedY = Math.max(0, Math.min(oy, height)); // 위치 클램핑
      if (last) {
        // 드래그 종료 시 스냅 동작
        oy > height * 0.5 || (vy > 0.5 && dy > 0 && close());
      } else {
        // 드래그 중 실시간 위치 업데이트
        api.start({ y: clampedY, immediate: true });
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    },
  );

  const sheetBind = useDrag(
    ({
      last,
      offset: [, oy],
      velocity: [, vy],
      direction: [, dy],
      cancel,
      canceled,
    }) => {
      const scrollRef = ScrollRef.current;

      if (!scrollRef) return;

      // 내부 스크롤이 최상단인지 확인
      const isAtTop = scrollRef.scrollTop <= 0;

      setTest(
        `${oy - height},이름은:${scrollRef.scrollTop},${oy},${height}, ${dy}, ${vy}, ${last}, ${!!canceled}, 깨랑 까랑`,
      );
      if (isAtTop && !isExternalCloseFunc) {
        console.log('카라멜');
        setTest(
          `${oy - height},${oy},${height},이름은:${scrollRef.scrollTop}, ${dy}, ${vy}, ${last}, ${!!canceled}, 입니다만`,
        );
        binds(oy - height, dy, vy, last, cancel, !!canceled);
      }
    },
    {
      from: () => [0, sheetY.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    },
  );

  const display = y.to((py) => (py < height - 10 ? 'contents' : 'none'));

  const bgStyle = {
    opacity: y.to([0, height], [0.5, 0], 'clamp'),
  };

  const fixedByOpen = () => {
    // react native로 popup 고정 해제 전달

    open({ canceled: false });
    console.log('열려라?');
    if (!isFixed) return;
    console.log('열려라???');
    sendPopupEvent(true);
    document.documentElement.style.overflow = OVERFLOW_HIDDEN;
    document.documentElement.style.touchAction = 'none';
    document.body.style.overflow = OVERFLOW_HIDDEN;
    document.body.style.touchAction = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = '100%';
    setScrollY(window.scrollY);
    document.body.style.position = 'fixed';
  };

  const removeFixedByClose = () => {
    // react native로 popup 고정 해제 전달

    console.log('실행?');
    if (!isFixed) return;
    console.log('실행???');
    sendPopupEvent(false);
    document.documentElement.style.overflow = '';
    document.documentElement.style.touchAction = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.documentElement.style.overscrollBehavior = '';
    document.body.style.overscrollBehavior = '';

    document.body.style.position = '';

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY });
    });
  };

  useEffect(() => {
    if (isOpen) {
      // react native로 popup 고정 전달

      fixedByOpen();
    } else {
      // react native로 popup 고정 해제 전달
      removeFixedByClose();
    }
  }, [isOpen]);

  useEffect(() => {
    const headerElement = BottomSheetHeaderRef.current;
    if (!headerElement) return;

    const observer = new ResizeObserver(() => {
      setHeaderHeight(headerElement.clientHeight);
    });

    observer.observe(headerElement);

    return () => observer.disconnect();
  }, [bottomSheetHeader]);

  useEffect(() => {
    const bottomElement = BottomSheetBottomRef.current;
    if (!bottomElement) return;

    const observer = new ResizeObserver(() => {
      setBottomHeight(bottomElement.clientHeight);
    });

    observer.observe(bottomElement);

    return () => observer.disconnect();
  }, [BottomSheetBottom]);

  useEffect(() => {
    if (!isExternalCloseFunc) return;
    close();
    if (setIsExternalCloseFunc) {
      setIsExternalCloseFunc(false);
    }
  }, [isExternalCloseFunc]);

  return (
    <BottomSheetLayoutConatiner
      ref={BottomSnapSheetLayoutRef}
      as={animated.div}
      style={{ display: display }}
    >
      <OverlayBackground
        as={animated.div}
        onClick={() => close()}
        style={bgStyle}
      />
      <BottomSheetContainer
        ref={BottomSheetContainerRef}
        as={animated.div}
        style={{ bottom: `calc(-100dvh + ${height - 100}px)`, y: y }}
      >
        <PopupScrollContainer
          as={animated.div}
          $bottomSheetHeightNum={touchHeaderHeightNum}
          {...scrollBarbind()}
        >
          <PopupScrollBar />
          <div>{test}</div>
        </PopupScrollContainer>
        <BottomSheetHeader ref={BottomSheetHeaderRef}>
          {bottomSheetHeader}
        </BottomSheetHeader>
        <BottomSheetWrap
          ref={ScrollRef}
          $heightNum={
            height - touchHeaderHeightNum - headerHeight - bottomHeight
          }
          as={animated.div}
          {...sheetBind()}
        >
          {children}
        </BottomSheetWrap>
        <BottomSheetBottomWrap ref={BottomSheetBottomRef}>
          {BottomSheetBottom}
        </BottomSheetBottomWrap>
      </BottomSheetContainer>
    </BottomSheetLayoutConatiner>
  );
};

const BottomSheetLayoutConatiner = styled.div`
  z-index: 500;
  width: 100%;
  height: 100%;
`;

const OverlayBackground = styled.div`
  height: 100dvh;
  position: fixed;
  overflow: hidden;
  z-index: 1020;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
`;

const BottomSheetContainer = styled.div`
  z-index: 1029;
  position: fixed;
  height: calc(100dvh + 100px);
  width: 100%;
  border-radius: 20px 20px 0 0;
  background: #fff;
  will-change: auto;
  user-select: none;
  overscroll-behavior: none;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  }
`;

const BottomSheetWrap = styled.div<{ $heightNum: number }>`
  height: ${(props) => props.$heightNum}px;
  overflow-y: scroll;

  overscroll-behavior: none;
  touch-action: pan-y;
  transform: none;
  user-select: none;
  // touch-action: pan-x;
  will-change: auto;
`;

const PopupScrollContainer = styled.div<{ $bottomSheetHeightNum: number }>`
  height: ${(props) => props.$bottomSheetHeightNum}px;
  width: 100%;
  z-index: 1000;
  display: flex;
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 20px 20px 0 0;
`;

const PopupScrollBar = styled.div`
  height: 4px;
  width: 50px;
  border-radius: 3px;
  display: flex;
  margin: 7px auto 0 auto;
  background-color: ${({ theme }) => theme.grey.Grey2};
`;

const BottomSheetHeader = styled.div``;

const BottomSheetBottomWrap = styled.div``;

export default BottomSnapSheetLayout;
