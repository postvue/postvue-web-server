import { useCallback, useEffect, useRef, useState } from 'react';

type UseResizeObserverHook = {
  ref: React.RefObject<HTMLDivElement>;
  height: number;
  width: number;
};

const useResizeObserver = (): UseResizeObserverHook => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (!entries || entries.length === 0) return;

    const { contentRect } = entries[0];
    setSize({
      width: contentRect.width,
      height: contentRect.height,
    });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  return { ref, width: size.width, height: size.height };
};

export default useResizeObserver;
