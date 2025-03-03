import React, { useEffect, useRef } from 'react';

const BodyFixScrollElement: React.FC = () => {
  const scrollY = useRef<number>(0);
  useEffect(() => {
    scrollY.current = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.left = '0px';
    document.body.style.right = '0px';
    document.body.style.width = '100%'; // 레이아웃 흔들림 방지

    // bodyElement.style.top = '0';
    // bodyElement.style.left = '0';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';

      window.scrollTo(0, scrollY.current);
    };
  }, []);
  return <></>;
};

export default BodyFixScrollElement;
