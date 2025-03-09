import { OVERFLOW_HIDDEN } from 'const/AttributeConst';
import React, { useEffect } from 'react';

const BodyHiddenScrollElement: React.FC = () => {
  useEffect(() => {
    const isHidden = document.body.style.overflow === OVERFLOW_HIDDEN;
    if (!isHidden) {
      document.body.style.overflow = OVERFLOW_HIDDEN;
    }

    document.body.style.touchAction = 'none';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      if (!isHidden) {
        document.body.style.overflow = '';
      }

      document.body.style.touchAction = '';
      document.body.style.overscrollBehavior = '';
    };
  }, []);
  return <></>;
};

export default BodyHiddenScrollElement;
