import { ReactComponent as ProfilePostMapExploreButtonIcon } from 'assets/images/icon/svg/post/ProfilePostMapExploreButtonIcon.svg';
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
  activePostSelectMapContentPopupInfoAtom,
  isExternalClosePostDetailPopupAtom,
} from 'states/PostAtom';
import styled from 'styled-components';
import ReactionLongPressButtonTemplate from '../posts/body/ReactionLongPressButtonTemplate';

interface PostMapExploreButtonProps {
  latitude: number;
  longitude: number;
  address?: string;
  buildName?: string;
  onClickFunc?: () => void;
}

const PostMapExploreButton: React.FC<PostMapExploreButtonProps> = ({
  latitude,
  longitude,
  address,
  buildName,
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

  const setActivePostSelectMapContentPopupInfo = useSetRecoilState(
    activePostSelectMapContentPopupInfoAtom,
  );

  return (
    <>
      <ReactionLongPressButtonTemplate resize={0.85} resizeSpeedRate={0.2}>
        <PostMapExploreButtonWrap
          onClick={(e) => {
            // if (location.pathname === EXPLORE_PATH) {
            //   if (latitude && longitude) {
            //     setMapContentType(MAP_CONTENT_LOCATION_TYPE);
            //     setMapLoaction({
            //       isMoveCenter: true,
            //       latitude: latitude,
            //       longitude: longitude,
            //     });

            //     const searchParam = location.search;

            //     if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
            //       navigate(-1);
            //       setIsClickAnnotation(true);
            //     } else {
            //       setIsExternalClosePostDetailPopup(true);
            //       setIsClickAnnotation(true);
            //     }
            //   }
            // } else {
            //   setIsMapExplorePopup(true);
            // }

            setActivePostSelectMapContentPopupInfo({
              isActive: true,
              latitude: latitude || null,
              longitude: longitude || null,
              onClickFunc: onClickFunc,
              address: address || '',
              buildName: buildName || '',
            });
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
