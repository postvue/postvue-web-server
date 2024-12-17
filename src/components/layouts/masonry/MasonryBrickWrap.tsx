import React, { useEffect, useRef } from 'react';

type WrapProps = {
  children: React.ReactNode;
  wrapRefs: React.RefObject<HTMLDivElement>[];
};

const MasonryBrickWrap: React.FC<WrapProps> = ({ children, wrapRefs }) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wrapRefs.push(wrapRef);
  }, [wrapRefs]);

  return (
    <div className="masonry-brick-wrap" ref={wrapRef}>
      {children}
    </div>
  );
};

export default MasonryBrickWrap;
