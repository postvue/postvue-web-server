import _debounce from 'lodash/debounce';
import { useCallback, useEffect, useRef } from 'react';

interface PropsType {
  path: string;
}

const useWindowScrollY = ({
  path,
}: PropsType): { scrollInfos: number; scrollRemove: () => void } => {
  const scrollY = useRef(Number(sessionStorage.getItem(`${path}_scroll_pos`)));

  const scrollRemove = useCallback(() => {
    scrollY.current = 0;
    sessionStorage.removeItem(`${path}_scroll_pos`);
  }, []);

  const saveScroll = _debounce(function () {
    scrollY.current = window.scrollY;
  }, 50);

  useEffect(() => {
    window.addEventListener('scroll', saveScroll);
    return () => {
      window.removeEventListener('scroll', saveScroll);
      sessionStorage.setItem(`${path}_scroll_pos`, String(scrollY.current));
    };
  }, []);

  return { scrollInfos: scrollY.current, scrollRemove };
};

export default useWindowScrollY;
