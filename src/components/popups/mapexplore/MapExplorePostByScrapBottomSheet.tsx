import React, { useEffect, useState } from 'react';
import MapExplorePostBottomSheet from './MapExplorePostBottomSheet';

interface MapExplorePostByScrapBottomSheetProps {
  children: React.ReactNode;
  initTime?: number;
}

const MapExplorePostByScrapBottomSheet: React.FC<
  MapExplorePostByScrapBottomSheetProps
> = ({ children, initTime = 500 }) => {
  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, initTime);
  }, []);

  return (
    <MapExplorePostBottomSheet
      hasGeoCurrentPositionButton={false}
      hasGeoPositionRefreshButton={false}
    >
      {init && <div>{children}</div>}
    </MapExplorePostBottomSheet>
  );
};

export default MapExplorePostByScrapBottomSheet;
