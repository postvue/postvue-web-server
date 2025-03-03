import ProfileScrapBody from 'components/profile/ProfileScrapBody';
import React, { useEffect, useState } from 'react';
import MapExplorePostBottomSheet from './MapExplorePostBottomSheet';

interface MapExplorePostByScrapBottomSheetProps {
  funcPrevButton?: () => void;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  scrapId: string;
}

const MapExplorePostByScrapBottomSheet: React.FC<
  MapExplorePostByScrapBottomSheetProps
> = ({ funcPrevButton, linkPopupInfo, scrapId }) => {
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
      <div>{init && <ProfileScrapBody scrapId={scrapId} isEdit={false} />}</div>
    </MapExplorePostBottomSheet>
  );
};

export default MapExplorePostByScrapBottomSheet;
