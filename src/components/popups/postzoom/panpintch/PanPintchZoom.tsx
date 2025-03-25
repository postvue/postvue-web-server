import React from 'react';
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';

interface PanPitchZoomProps {
  children: React.ReactNode;
  onZoom?: (isZooming: boolean) => void;
  zoomable?: boolean;
  zooming?: boolean;
}

const PanPitchZoom: React.FC<PanPitchZoomProps> = ({
  children,
  onZoom = () => {
    ('');
  },
  zoomable = false,
  zooming = false,
}) => {
  const handlePinchingStop = (ref: ReactZoomPanPinchRef, event: TouchEvent) => {
    const isZooming = ref.state.scale > 1;
    onZoom(isZooming);
  };

  return (
    <TransformWrapper
      disabled={!zoomable}
      doubleClick={{ mode: 'reset' }}
      initialScale={1}
      panning={{ disabled: !zooming }}
      onPinchingStop={handlePinchingStop}
    >
      <div className="Page" onDoubleClick={() => onZoom(false)}>
        <TransformComponent>{children}</TransformComponent>
      </div>
    </TransformWrapper>
  );
};

export default PanPitchZoom;
