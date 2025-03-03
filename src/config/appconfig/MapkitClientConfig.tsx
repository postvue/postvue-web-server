import { useMap } from 'components/lib/mapkitjs/useMap';
import React, { useEffect } from 'react';
const MapkitClientConfig: React.FC = () => {
  const { map } = useMap();
  useEffect(() => {
    return () => {
      if (!map) return;
      map.destroy();
    };
  }, []);
  return null;
};

export default MapkitClientConfig;
