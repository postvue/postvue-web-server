import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import React, { useEffect, useRef, useState } from 'react';
import theme from 'styles/theme';

import SwiperCore from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { lock, unlock } from 'tua-body-scroll-lock';

interface ViewPagerLayoutProps {
  childrenList: React.ReactNode[];
  index: number | undefined;
  actionSilde: (index: number) => void;
  scrollToInfo?: {
    tabId: number;
    scrollTo: number;
  };
  externalRefs?: React.MutableRefObject<HTMLDivElement[]>;
}

const ViewPagerLayout: React.FC<ViewPagerLayoutProps> = ({
  childrenList,
  index,
  actionSilde,
  scrollToInfo,
  externalRefs,
}) => {
  const [swiper, setSwiper] = useState<SwiperCore>();
  const objectListRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (index === undefined || !swiper) return;
    swiper.slideTo(index);
  }, [index, swiper]);

  useBodyAdaptProps([
    { key: 'position', value: 'fixed' },
    { key: 'overflow', value: 'hidden' },
    { key: 'left', value: '0' },
    { key: 'right', value: '0' },
    { key: 'top', value: '0' },
    { key: 'bottom', value: '0' },
  ]);

  useEffect(() => {
    const targetRefs = externalRefs?.current ?? objectListRef.current;
    const elements = targetRefs.filter((el) => el);

    lock(elements);

    return () => {
      unlock([], { useGlobalLockState: true });
    };
  }, [externalRefs]);

  useEffect(() => {
    if (!scrollToInfo) return;

    const ref =
      externalRefs?.current?.[scrollToInfo.tabId] ??
      objectListRef.current[scrollToInfo.tabId];

    if (!ref) return;

    // if (ref.scrollHeight <= 10000) {
    ref.scrollTo({ top: scrollToInfo.scrollTo, behavior: 'smooth' });
    // } else {
    //   ref.scrollTo(0, 0);
    // }
  }, [scrollToInfo, externalRefs]);

  const swiperTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!swiper) return;

    swiperTimerRef.current = setTimeout(() => {
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({ identifier: 1, target: document.body })],
      });

      window.dispatchEvent(touchEvent);
    }, 500);

    return () => {
      if (swiperTimerRef.current) {
        clearTimeout(swiperTimerRef.current);
      }
    };
  }, [swiper]);

  return (
    <Swiper
      onSwiper={setSwiper}
      initialSlide={index}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{ clickable: true }}
      onSlideChange={(swiper: SwiperCore) => {
        actionSilde(swiper.activeIndex);
      }}
    >
      {childrenList.map((v, i) => (
        <SwiperSlide key={i}>
          <div
            ref={(el) => {
              if (!el) return;
              if (externalRefs) {
                externalRefs.current[i] = el;
              } else {
                objectListRef.current[i] = el;
              }
            }}
            style={{
              height: `calc(100dvh - ${
                theme.systemSize.header.heightNumber +
                theme.systemSize.bottomNavBar.heightNum
              }px)`,
              overflow: 'scroll',
            }}
          >
            {v}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ViewPagerLayout;
