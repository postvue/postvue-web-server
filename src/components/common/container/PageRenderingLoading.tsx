import React, { useEffect, useRef, useState } from 'react';
import LoadingComponent from './LoadingComponent';

const PageRenderingLoading: React.FC = () => {
  const [init, setInit] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  return <>{init && <LoadingComponent />}</>;
};

export default PageRenderingLoading;
