import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import LoadingPopup from 'components/popups/LoadingPopup';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { mapMoveLocationAtom } from 'states/MapExploreAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';

import { ReactComponent as MapExplorePopupCloseButtonIcon } from 'assets/images/icon/svg/explore/MapExplorePopupCloseButtonIcon.svg';
import AppleMapElement from 'components/mapexplore/body/AppleMapElement';
import GeoCurrentPositionButton from 'components/mapexplore/GeoCurrentPositionButton';
import ProfileScrapBody from 'components/profile/ProfileScrapBody';
import { isEmptyObject } from 'global/util/ObjectUtil';
import { PostMapPostInfiniteInterface } from 'hook/queryhook/QueryStatePostMapPostInfinite';
import { QueryStateProfileScrap } from 'hook/queryhook/QueryStateProfileScrap';
import MapExplorePostByScrapBottomSheet from './MapExplorePostByScrapBottomSheet';

interface MapExploreByScrapPopupBodyProps {
  scrapId: string;
  funcPrevButton: () => void;
  isMobile?: boolean;
}

const MapExploreByScrapPopupBody: React.FC<MapExploreByScrapPopupBodyProps> = ({
  scrapId,
  funcPrevButton,
  isMobile = true,
}) => {
  const setMapMoveLoation = useSetRecoilState(mapMoveLocationAtom);

  const isLoadingPopup = useRecoilValue(isLoadingPopupAtom);

  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 300);
  }, []);

  const { data: profileScrap } = QueryStateProfileScrap(scrapId);

  const GeoCurrentButtonSize = 50;

  return (
    <>
      <MapExplorePopupContainer>
        <MapExploreHeaderWrap>
          <MapExplorePopupCloseButtonnWrap onClick={funcPrevButton}>
            <MapExplorePopupCloseButtonnSubWrap>
              <MapExplorePopupCloseButtonn>
                <MapExplorePopupCloseButtonIcon />
              </MapExplorePopupCloseButtonn>
            </MapExplorePopupCloseButtonnSubWrap>
          </MapExplorePopupCloseButtonnWrap>
        </MapExploreHeaderWrap>

        <MapExploreWrap>
          <MapExploreSubWrap>
            {!isMobile && (
              <>
                <GeoCurrentPositionButtonWrap>
                  <GeoCurrentPositionButton
                    buttonSize={GeoCurrentButtonSize}
                    GeoCurrentButtonStyle={{ position: 'static' }}
                  />
                </GeoCurrentPositionButtonWrap>
              </>
            )}

            {init && (
              <AppleMapElement
                mapPost={
                  profileScrap
                    ? ({
                        pages: profileScrap.pages.map((v) => {
                          return v.snsPostRspList.filter(
                            (v) => !isEmptyObject(v.location),
                          );
                        }),
                        pageParams: [],
                      } as PostMapPostInfiniteInterface)
                    : undefined
                }
                // isRefresh={
                //   profileScrap ? profileScrap.pages.length <= 0 : false
                // }
                // onSetMapMoveLocation={(moveLocation: MoveLocationType) =>
                //   setMapMoveLoation((prev) => ({
                //     ...prev,
                //     isMoved: moveLocation.isMoved,
                //     latitude: moveLocation.latitude,
                //     longitude: moveLocation.longitude,
                //   }))
                // }
                coordinateSpan={1}
              />
            )}
          </MapExploreSubWrap>
        </MapExploreWrap>

        {isMobile ? (
          //   <MapExplorePostPopup
          //   onChangeMap={onChangeMap}
          //   funcPrevButton={funcPrevButton}
          //   linkPopupInfo={{
          //     isLinkPopup: false,
          //     isReplaced: true,
          //   }}
          // />
          <MapExplorePostByScrapBottomSheet>
            <ProfileScrapBody scrapId={scrapId} isEdit={false} />
          </MapExplorePostByScrapBottomSheet>
        ) : (
          <MapPostExploreBodyWrap>
            <ProfileScrapBody scrapId={scrapId} isEdit={false} />
          </MapPostExploreBodyWrap>
        )}
      </MapExplorePopupContainer>

      {isLoadingPopup && (
        <LoadingPopup LoadingPopupStyle={{ background: 'transparent' }} />
      )}
    </>
  );
};
const MapFullMargin = 10;
const GeoButtonMargin = 20;

const MapExplorePopupContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  height: 100%;
  z-index: 100;
`;

const MapExploreHeaderWrap = styled.div`
  padding-top: env(safe-area-inset-top);
  z-index: 200;
  width: 100%;
  position: absolute;
  display: flex;

  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin-top: ${MapFullMargin}px;
  }

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    position: fixed;
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
    z-index: 1000;
  }
`;

const MapExploreWrap = styled.div`
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  height: 100vh;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    position: static;
    height: 500px;
    margin: 0;
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
  }
`;
const MapExploreSubWrap = styled.div`
  height: 100%;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    position: relative;
    padding: 0px;
  }
`;

const MapPostExploreBodyWrap = styled.div`
  bottom: 0px;
  background-color: white;
  margin-top: 10px;
  flex: 1;

  overflow: scroll;
  flex-grow: 1;

  bottom: 0px;
`;

const MapExplorePopupCloseButtonnWrap = styled.div`
  position: absolute;
  right: 0px;
  height: 60px;
  display: flex;
`;

const MapExplorePopupCloseButtonnSubWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 40px;
  border: 2px solid white;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  margin: auto 10px auto 0;
`;

const MapExplorePopupCloseButtonn = styled.div`
  display: flex;
  margin: auto;
`;

const GeoCurrentPositionButtonWrap = styled.div`
  position: absolute;
  z-index: 10;
  left: ${GeoButtonMargin}px;
  bottom: ${GeoButtonMargin}px;
`;

export default MapExploreByScrapPopupBody;
