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
}

const ViewPagerLayout: React.FC<ViewPagerLayoutProps> = ({
  childrenList,
  index,
  actionSilde,
  scrollToInfo,
}) => {
  const [swiper, setSwiper] = useState<SwiperCore>();

  useEffect(() => {
    if (index === undefined || !swiper) return;

    swiper.slideTo(index);
  }, [index]);

  useBodyAdaptProps([
    { key: 'position', value: 'fixed' },
    { key: 'overflow', value: 'hidden' },
    { key: 'left', value: '0' },
    { key: 'right', value: '0' },
    { key: 'top', value: '0' },
    { key: 'bottom', value: '0' },
  ]);
  const objectListRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    lock(objectListRef.current.map((v) => v));

    return () => {
      unlock([], {
        useGlobalLockState: true,
      });
    };
  }, []);

  useEffect(() => {
    if (!scrollToInfo) return;

    objectListRef.current[scrollToInfo.tabId].scrollTo({
      top: scrollToInfo.scrollTo,
      behavior: 'smooth',
    });
  }, [scrollToInfo]);

  useEffect(() => {
    if (!swiper) return;

    setTimeout(() => {
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({ identifier: 1, target: document.body })],
      });

      window.dispatchEvent(touchEvent);
    }, 500);
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
            ref={(e) => {
              if (!e) return;
              objectListRef.current[i] = e;
            }}
            style={{
              height: `calc(100dvh - ${theme.systemSize.header.heightNumber + theme.systemSize.bottomNavBar.heightNum}px)`,
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
