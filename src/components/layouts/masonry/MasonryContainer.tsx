import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
};

const MasonryContainer: React.FC<ContainerProps> = ({
  children,
  containerRef,
}) => {
  return (
    <div id="masonry-container" ref={containerRef}>
      {children}
    </div>
  );
};

export default MasonryContainer;
