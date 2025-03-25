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
  // sessionStorage에서 기존 값 가져오기
  const savedScrollPos = sessionStorage.getItem(`${path}_scroll_pos`);
  const scrollY = useRef(savedScrollPos ? Number(savedScrollPos) : 0);

  // 스크롤 값 저장 함수 (debounce 적용)
  const saveScroll = useCallback(
    _debounce(() => {
      scrollY.current = refObject?.current?.scrollTop || window.scrollY;
      sessionStorage.setItem(`${path}_scroll_pos`, String(scrollY.current));
    }, 50),
    [refObject, path],
  );

  // 스크롤 제거 함수 (path 변경 시에도 정상 동작)
  const scrollRemove = useCallback(() => {
    scrollY.current = 0;
    sessionStorage.removeItem(`${path}_scroll_pos`);
  }, [path]);

  useEffect(() => {
    const target = refObject?.current || window;
    target.addEventListener('scroll', saveScroll);

    return () => {
      target.removeEventListener('scroll', saveScroll);
    };
  }, [saveScroll, refObject]);

  return { scrollInfos: scrollY.current, scrollRemove };
};

export default useObjectScrollY;
