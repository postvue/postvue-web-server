import React, { useEffect, useState } from 'react';
import LoadingComponent from './LoadingComponent';

const PageRenderingLoading: React.FC = () => {
  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 500);
  }, []);
  return <>{init && <LoadingComponent />}</>;
};

export default PageRenderingLoading;
