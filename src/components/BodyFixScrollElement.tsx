import React, { useEffect } from 'react';
import { OVERFLOW_HIDDEN, OVERFLOW_SCROLL } from '../const/AttributeConst';
const BodyFixScrollElement: React.FC = () => {
  useEffect(() => {
    const bodyElement = document.body;
    bodyElement.style.overflow = OVERFLOW_HIDDEN;

    return () => {
      bodyElement.style.overflow = OVERFLOW_SCROLL;
    };
  }, []);
  return <></>;
};

export default BodyFixScrollElement;
