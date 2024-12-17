import { OVERFLOW_HIDDEN } from 'const/AttributeConst';
import React, { useEffect } from 'react';

const BodyHiddenScrollElement: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = OVERFLOW_HIDDEN;
    document.body.style.touchAction = 'none';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.overscrollBehavior = '';
    };
  }, []);
  return <></>;
};

export default BodyHiddenScrollElement;
