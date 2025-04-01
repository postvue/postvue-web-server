import React, { useEffect, useState } from 'react';
import MapExplorePostBottomSheet from './MapExplorePostBottomSheet';

interface MapExplorePostByScrapBottomSheetProps {
  children: React.ReactNode;
}

const MapExplorePostByScrapBottomSheet: React.FC<
  MapExplorePostByScrapBottomSheetProps
> = ({ children }) => {
  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 500);
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
