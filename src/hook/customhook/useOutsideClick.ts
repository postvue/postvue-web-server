import { useEffect } from 'react';

function useOutsideClick<T extends HTMLElement>(
  refs: React.RefObject<T>[], // 여러 Ref를 배열로 받음
  callback: () => void,
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.length > 0 &&
        refs.every(
          (ref) => ref.current && !ref.current.contains(event.target as Node),
        )
      ) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, ...refs.map((ref) => ref.current)]); // ref의 current 값만 의존성 배열에 포함

  return;
}

export default useOutsideClick;
