import React, { Children, useState } from 'react';

interface PinPintchZoomProps {
  children: React.ReactNode;
  current: number;
  onChange?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  pageWidth: number;
  zoomable: boolean;
  scrollable: boolean;
  transitionless: boolean;
}

const PinPintchZoom: React.FC<PinPintchZoomProps> = ({
  children,
  current = 0,
  onChange = () => '',
  onPrevious = () => '',
  onNext = () => '',
  pageWidth,
  zoomable = false,
  scrollable = false,
  transitionless = false,
}) => {
  const pages = Children.toArray(children);
  const [zooming, setZooming] = useState(false);
  // const {
  //   controls,
  //   dragging,
  //   dragConstraints,
  //   handleDrag,
  //   handleDragEnd,
  //   handleDragStart,
  //   ref,
  // } = usePager({
  //   current,
  //   pagesCount: pages.length,
  //   pageWidth,
  //   onChange,
  //   onPrevious,
  //   onNext,
  //   scrollable,
  //   transitionless,
  // });

  // const handleZoom = (isZooming: boolean) => setZooming(isZooming);

  return (
    <></>
    // <motion.div
    //   animate={controls}
    //   className="Pager"
    //   drag={!zooming && 'x'}
    //   dragConstraints={dragConstraints}
    //   dragElastic={0.05}
    //   dragMomentum={scrollable}
    //   onDrag={handleDrag}
    //   onDragEnd={handleDragEnd}
    //   onDragStart={handleDragStart}
    //   ref={ref}
    // >
    //   {pages.map((item, i) => (
    //     <Page key={i} onZoom={handleZoom} zoomable={zoomable} zooming={zooming}>
    //       {item}
    //     </Page>
    //   ))}
    // </motion.div>
  );
};

export default PinPintchZoom;
