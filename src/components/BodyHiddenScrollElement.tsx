import { OVERFLOW_AUTO, OVERFLOW_HIDDEN } from 'const/AttributeConst';
import React, { useEffect } from 'react';

const BodyHiddenScrollElement: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = OVERFLOW_HIDDEN;

    return () => {
      document.body.style.overflow = OVERFLOW_AUTO;
    };
  }, []);
  return <></>;
};

export default BodyHiddenScrollElement;
