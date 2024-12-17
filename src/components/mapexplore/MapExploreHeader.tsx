import React from 'react';
import MapExploreSearchHeader from './header/MapExploreSearchHeader';

interface MapExploreHeaderProps {
  address: string;
  MapExploreActiveHeaderStyle?: React.CSSProperties;
  MapExploreNotActiveHeaderStyle?: React.CSSProperties;
  SearchButtonInputLayoutActiveStyle?: React.CSSProperties;
  SearchButtonInputLayoutNotActiveStyle?: React.CSSProperties;
}

const MapExploreHeader: React.FC<MapExploreHeaderProps> = ({
  address,
  MapExploreActiveHeaderStyle,
  MapExploreNotActiveHeaderStyle,
  SearchButtonInputLayoutActiveStyle,
  SearchButtonInputLayoutNotActiveStyle,
}) => {
  return (
    <MapExploreSearchHeader
      MapExploreHeaderActiveContainer={MapExploreActiveHeaderStyle}
      MapExploreHeaderNotActiveContainer={MapExploreNotActiveHeaderStyle}
      SearchButtonInputLayoutActiveStyle={SearchButtonInputLayoutActiveStyle}
      SearchButtonInputLayoutNotActiceStyle={
        SearchButtonInputLayoutNotActiveStyle
      }
      address={address}
    />
  );
};

export default MapExploreHeader;
