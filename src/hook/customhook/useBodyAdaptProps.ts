import { useEffect, useRef, useState } from 'react';

interface PropKeyValue {
  key: string;
  value: string;
}

const useBodyAdaptProps = (
  adaptPropList: PropKeyValue[],
  timer = 0,
  onFuncByClose?: () => void,
  isActive = true,
): void => {
  const body = document.body;
  const [prevBodyProps, setPrevBodyProps] = useState<Map<string, string>>(
    new Map(),
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const tempBodyPropsList = new Map(prevBodyProps);

    timerRef.current = setTimeout(() => {
      try {
        // 기존 body 스타일 저장
        adaptPropList.forEach(({ key }) => {
          const prop = body.style.getPropertyValue(key);
          tempBodyPropsList.set(key, prop);
        });

        setPrevBodyProps(tempBodyPropsList);
      } catch (e) {
        console.error('Error saving previous styles:', e);
      }

      try {
        // 새로운 스타일 적용
        adaptPropList.forEach(({ key, value }) => {
          body.style.setProperty(key, value);
        });
      } catch (e) {
        console.error('Error applying new styles:', e);
      }
    }, timer);

    return () => {
      // 기존 스타일 복원
      if (timerRef.current) clearTimeout(timerRef.current);
      tempBodyPropsList.forEach((value, key) => {
        try {
          body.style.setProperty(key, value);
        } catch (e) {
          console.error('Error restoring styles:', e);
        }
      });
      if (onFuncByClose) {
        onFuncByClose();
      }
    };
  }, []);
};

export default useBodyAdaptProps;
