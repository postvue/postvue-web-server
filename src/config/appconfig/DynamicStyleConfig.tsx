import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect } from 'react';

const DynamicStyleConfig: React.FC = () => {
  const { windowWidth } = useWindowSize();
  useEffect(() => {
    if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
      document.body.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overscrollBehavior = 'contain';
    }
  }, [windowWidth]);
  return <></>;
};

export default DynamicStyleConfig;
