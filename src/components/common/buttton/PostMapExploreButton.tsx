import { ReactComponent as ProfilePostMapExploreButtonIcon } from 'assets/images/icon/svg/post/ProfilePostMapExploreButtonIcon.svg';
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
import { isExternalClosePostDetailPopupAtom } from 'states/PostAtom';
import styled from 'styled-components';
import ReactionLongPressButtonTemplate from '../posts/body/ReactionLongPressButtonTemplate';

interface PostMapExploreButtonProps {
  latitude?: number;
  longitude?: number;
  onClickFunc?: () => void;
}

const PostMapExploreButton: React.FC<PostMapExploreButtonProps> = ({
  latitude,
  longitude,
  onClickFunc,
}) => {
  const setIsMapExplorePopup = useSetRecoilState(isMapExplorePopupAtom);

  const setMapLoaction = useSetRecoilState(mapLoactionAtom);
  const setMapContentType = useSetRecoilState(mapContentTypeAtom);

  const setIsExternalClosePostDetailPopup = useSetRecoilState(
    isExternalClosePostDetailPopupAtom,
  );

  const [isClickAnnotation, setIsClickAnnotation] = useRecoilState(
    isClickAnnotationAtom,
  );

  const navigate = useNavigate();
  const location = useLocation();

  const { windowWidth } = useWindowSize();

  return (
    <>
      <ReactionLongPressButtonTemplate resize={0.85} resizeSpeedRate={0.2}>
        <PostMapExploreButtonWrap
          onClick={(e) => {
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

            e.stopPropagation();
          }}
        >
          <ProfilePostMapExploreButtonIcon />
        </PostMapExploreButtonWrap>
      </ReactionLongPressButtonTemplate>
    </>
  );
};

const PostMapExploreButtonWrap = styled.div`
  cursor: pointer;
  display: flex;
`;

export default PostMapExploreButton;
