import React from 'react';
import MapExploreSearchHeader from './header/MapExploreSearchHeader';

interface MapExploreHeaderProps {
  address: string;
  MapExploreActiveHeaderStyle?: React.CSSProperties;
  MapExploreNotActiveHeaderStyle?: React.CSSProperties;
}

const MapExploreHeader: React.FC<MapExploreHeaderProps> = ({
  address,
  MapExploreActiveHeaderStyle,
  MapExploreNotActiveHeaderStyle,
}) => {
  return (
    <MapExploreSearchHeader
      MapExploreHeaderActiveContainer={MapExploreActiveHeaderStyle}
      MapExploreHeaderNotActiveContainer={MapExploreNotActiveHeaderStyle}
      address={address}
    />
  );
};

export default MapExploreHeader;
