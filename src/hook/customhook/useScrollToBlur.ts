import { useEffect, useRef } from 'react';

function useScrollToBlur(
  scrollContainerRef?: React.RefObject<HTMLElement>, // 감지할 스크롤 컨테이너 (없으면 window)
  callback?: () => void, // 키보드 닫힌 후 실행할 콜백 (옵션)
): void {
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = scrollContainerRef?.current
        ? scrollContainerRef.current.scrollTop // 내부 컨테이너 스크롤 값
        : window.scrollY; // window 스크롤 값

      const activeElement = document.activeElement as HTMLElement;

      // 위로 스크롤 감지 & 활성화된 입력 요소가 있는 경우
      if (
        currentScrollY < lastScrollY.current &&
        activeElement?.tagName === 'INPUT'
      ) {
        activeElement.blur(); // 키보드 비활성화
        if (callback) callback(); // 추가 콜백 실행 (필요 시)
      }

      lastScrollY.current = currentScrollY;
    };

    const scrollTarget = scrollContainerRef?.current || window;
    scrollTarget.addEventListener('scroll', handleScroll);

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
    };
  }, [callback, scrollContainerRef]);

  return;
}

export default useScrollToBlur;
