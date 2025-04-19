import { useEffect, useRef } from 'react';

export function useIOSKeyboardLock(): {
  activate: () => void;
  reset: () => void;
} {
  const scrollYRef = useRef<number>(0);
  const iosAsideGapRef = useRef<number>(0);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const handleResize = () => {
      if (!html.classList.contains('keyboard--on')) return;

      const currentViewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const scrollHeight =
        document.scrollingElement?.scrollHeight || document.body.scrollHeight;
      iosAsideGapRef.current = scrollHeight - currentViewportHeight;

      window.scrollTo(0, iosAsideGapRef.current);
      body.style.top = `${-(scrollYRef.current - iosAsideGapRef.current)}px`;
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  const activate = () => {
    scrollYRef.current = window.scrollY;
    document.documentElement.classList.add('keyboard--on');
    document.body.style.top = `${-scrollYRef.current}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  };

  const reset = () => {
    document.documentElement.classList.remove('keyboard--on');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollYRef.current);
  };

  return { activate, reset };
}
