import _debounce from 'lodash/debounce';
import { useCallback, useEffect, useRef } from 'react';

interface PropsType {
  refObject?: React.RefObject<HTMLDivElement>;
  path: string;
}

const useObjectScrollY = ({
  refObject,
  path,
}: PropsType): { scrollInfos: number; scrollRemove: () => void } => {
  const scrollY = useRef(Number(sessionStorage.getItem(`${path}_scroll_pos`)));

  const scrollRemove = useCallback(() => {
    scrollY.current = 0;
    sessionStorage.removeItem(`${path}_scroll_pos`);
  }, []);

  const saveScroll = _debounce(function () {
    scrollY.current = refObject
      ? refObject.current?.scrollTop || 0
      : window.scrollY;

    sessionStorage.setItem(`${path}_scroll_pos`, String(scrollY.current));
  }, 50);

  useEffect(() => {
    if (refObject) {
      if (!refObject.current) return;
      refObject.current.addEventListener('scroll', saveScroll);
    } else {
      window.addEventListener('scroll', saveScroll);
    }
    return () => {
      if (refObject) {
        if (!refObject.current) return;
        refObject.current.removeEventListener('scroll', saveScroll);
      } else {
        window.removeEventListener('scroll', saveScroll);
      }
    };
  }, []);

  return { scrollInfos: scrollY.current, scrollRemove };
};

export default useObjectScrollY;
