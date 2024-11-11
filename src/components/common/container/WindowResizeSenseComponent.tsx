import React, { useEffect } from 'react';

interface WindowResizeSenceComponentProps {
  setWindowSize: React.Dispatch<
    React.SetStateAction<{ width: number; height: number }>
  >;
}

const WindowResizeSenceComponent: React.FC<WindowResizeSenceComponentProps> = ({
  setWindowSize,
}) => {
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 창 크기가 변경될 때마다 handleResize 호출
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <></>;
};

export default WindowResizeSenceComponent;
