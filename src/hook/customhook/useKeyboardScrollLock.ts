import { useEffect, useRef } from 'react';

export function useKeyboardScrollLock(): void {
  const scrollYRef = useRef(0);

  const lockScroll = () => {
    scrollYRef.current = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    document.documentElement.style.overflow = 'hidden'; // html에도 적용
  };

  const unlockScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    document.documentElement.style.overflow = '';
    window.scrollTo(0, scrollYRef.current);
  };

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const isKeyboardVisible = viewportHeight < window.innerHeight * 0.75;

      if (isKeyboardVisible) {
        lockScroll();
      } else {
        unlockScroll();
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      unlockScroll();
    };
  }, []);
}
