import { useEffect, useState } from 'react';

export const useLocalStorageListener = (key: string): string | null => {
  const [value, setValue] = useState<string | null>(localStorage.getItem(key));

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(event.newValue);
      }
    };

    // 같은 탭에서 변경사항 감지
    window.addEventListener('storage', handleStorageChange);

    // 동일한 탭에서도 값 변경을 반영
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (k, v) {
      if (k === key) {
        setValue(v);
      }
      originalSetItem.call(this, k, v);
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem; // 원래 동작 복원
    };
  }, [key]);

  return value;
};
