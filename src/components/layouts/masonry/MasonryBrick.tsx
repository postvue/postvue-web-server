import React, { useEffect, useRef } from 'react';

type BrickProps = {
  children: React.ReactNode;
  brickRefs: React.RefObject<HTMLDivElement>[];
};

const MasonryBrick: React.FC<BrickProps> = ({ children, brickRefs }) => {
  const brickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    brickRefs.push(brickRef);
  }, [brickRefs]);

  return (
    <div className="masonry-brick" ref={brickRef}>
      {children}
    </div>
  );
};

export default MasonryBrick;
