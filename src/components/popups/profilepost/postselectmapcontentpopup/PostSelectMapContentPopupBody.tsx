import { ReactComponent as MapGuideIcon } from 'assets/images/icon/svg/explore/mapguide/MapGuideIcon.svg';
import { ReactComponent as PostNearIcon } from 'assets/images/icon/svg/explore/mapguide/PostNearIcon.svg';
import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import { MAP_CONTENT_LOCATION_TYPE } from 'const/MapExploreConst';
import { EXPLORE_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isClickAnnotationAtom,
  isMapExplorePopupAtom,
  mapContentTypeAtom,
  mapLoactionAtom,
} from 'states/MapExploreAtom';
import {
  activePostMapGuideSelectPopupInfoAtom,
  isExternalClosePostDetailPopupAtom,
} from 'states/PostAtom';
import styled from 'styled-components';
import { filterBrigntnessStyle09 } from 'styles/commonStyles';

interface PostSettingPopupBodyProps {
  onClickFunc?: () => void;
  onClose: () => void;
  latitude: number;
  longitude: number;
  address?: string;
  buildName?: string;
}

const PostSelectMapContentPopupBody: React.FC<PostSettingPopupBodyProps> = ({
  onClickFunc,
  onClose,
  latitude,
  longitude,
  address,
  buildName,
}) => {
  const setIsMapExplorePopup = useSetRecoilState(isMapExplorePopupAtom);

  const setMapLoaction = useSetRecoilState(mapLoactionAtom);
  const setMapContentType = useSetRecoilState(mapContentTypeAtom);

  const setIsExternalClosePostDetailPopup = useSetRecoilState(
    isExternalClosePostDetailPopupAtom,
  );
  const setActivePostMapGuideSelectPopupInfo = useSetRecoilState(
    activePostMapGuideSelectPopupInfoAtom,
  );

  const [isClickAnnotation, setIsClickAnnotation] = useRecoilState(
    isClickAnnotationAtom,
  );

  const navigate = useNavigate();
  const location = useLocation();

  const { windowWidth } = useWindowSize();
  return (
    <PostSettingPopupBodyContainer>
      <PostSettingContextWrap>
        <LongPressToResizeButton>
          <PostSettingTab
            onClick={() => {
              if (onClickFunc) {
                onClickFunc();
              }
              if (location.pathname === EXPLORE_PATH) {
                if (latitude && longitude) {
                  setMapContentType(MAP_CONTENT_LOCATION_TYPE);
                  setMapLoaction({
                    isMoveCenter: true,
                    latitude: latitude,
                    longitude: longitude,
                  });
                  const searchParam = location.search;
                  if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
                    navigate(-1);
                    setIsClickAnnotation(true);
                  } else {
                    setIsExternalClosePostDetailPopup(true);
                    setIsClickAnnotation(true);
                  }
                }
              } else {
                setIsMapExplorePopup(true);
              }
              onClose();
            }}
          >
            <PostSettingIconWrap>
              <PostNearIcon />
            </PostSettingIconWrap>
            <PostSettingTitle>주변 보기</PostSettingTitle>
          </PostSettingTab>
        </LongPressToResizeButton>
        <LongPressToResizeButton>
          <PostSettingTab
            onClick={() => {
              setActivePostMapGuideSelectPopupInfo({
                isActive: true,
                latitude: latitude,
                longitude: longitude,
                buildName: buildName,
                address: address,
              });
              onClose();
            }}
          >
            <PostSettingIconWrap>
              <MapGuideIcon />
            </PostSettingIconWrap>
            <PostSettingTitle>길찾기</PostSettingTitle>
          </PostSettingTab>
        </LongPressToResizeButton>
      </PostSettingContextWrap>
    </PostSettingPopupBodyContainer>
  );
};

const PostSettingPopupBodyContainer = styled.div`
  position: relative;
  flex-shrink: 1;
`;

const PostSettingContextWrap = styled.div`
  padding: 5px 15px;
  display: flex;
  flex-flow: column;
  gap: 8px;
`;

const PostSettingTab = styled.div`
  padding: 8px 10px;
  display: flex;
  gap: 10px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.grey.Grey05};
  border-radius: 14px;
  ${filterBrigntnessStyle09}
`;

const PostSettingIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

const PostSettingTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  line-height: 200%;
  color: ${({ theme }) => theme.grey.Grey8};
`;

export default PostSelectMapContentPopupBody;
