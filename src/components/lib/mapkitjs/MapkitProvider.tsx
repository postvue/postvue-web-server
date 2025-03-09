/* global mapkit */

import load from 'little-loader';
import React from 'react';

type MapkitContextType = {
  isInProvider: boolean;
  mapkit: typeof mapkit | undefined;
};

export const MapkitContext = React.createContext<MapkitContextType>({
  isInProvider: false,
  mapkit: undefined,
});

type ProviderProps = {
  // ⚠️ Pick between callbackUrl or token.
  // https://developer.apple.com/documentation/mapkitjs/mapkit/2974045-init
  tokenOrCallback: string;
  language?: string;
  children?: React.ReactNode;
};

let mapkitLoaded = false; // 전역 상태로 mapkit.js 로드 상태 추적

export const MapkitProvider: React.FC<ProviderProps> = ({
  tokenOrCallback,
  language,
  children,
}) => {
  const existingContext = React.useContext(MapkitContext);

  const [context, setContext] = React.useState<MapkitContextType>({
    mapkit: existingContext.mapkit,
    isInProvider: true,
  });

  React.useEffect(() => {
    if (!existingContext.isInProvider) {
      if (!mapkitLoaded) {
        mapkitLoaded = true;
        load('https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js', () => {
          const isCallback = tokenOrCallback.includes('/');

          // init mapkit
          mapkit.init({
            authorizationCallback: (done) => {
              if (isCallback) {
                fetch(tokenOrCallback)
                  .then((res) => res.text())
                  .then(done);
              } else {
                done(tokenOrCallback);
              }
            },
            language,
          });
          setContext({ mapkit, isInProvider: true });
        });
      } else {
        // 이미 mapkit이 로드되었으면 context 상태 업데이트

        setContext({ mapkit, isInProvider: true });
      }
    }
  }, [existingContext.isInProvider, tokenOrCallback, language]);

  return (
    <MapkitContext.Provider value={context}>{children}</MapkitContext.Provider>
  );
};
