import { useEffect, useState } from 'react';

const useWindowSize = (): { windowWidth: number; windowHeight: number } => {
  const [windowSize, setWindowSize] = useState({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    };

    // 창 크기 변경 이벤트 등록
    window.addEventListener('resize', handleResize);

    // 초기 값 설정
    handleResize();

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
