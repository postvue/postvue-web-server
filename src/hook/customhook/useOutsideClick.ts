import { useEffect } from 'react';
function useOutsideClick<T extends HTMLElement>(
  refs: React.RefObject<T>[], // 여러 Ref를 배열로 받음
  callback: () => void,
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 모든 ref 중 하나라도 이벤트 대상 포함 여부 확인
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node),
      );

      if (isOutside) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, callback]); // refs와 callback이 변경될 때만 동작

  return;
}

export default useOutsideClick;
