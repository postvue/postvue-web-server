import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { POST_COMPOSE_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
} from 'states/PostComposeAtom';
import PopupLayout from '../../../layouts/PopupLayout';
import PostComposeBySourceUrlPopupBody from './PostComposeBySourceUrlPopupBody';

const PostComposeBySourceUrlPopup: React.FC = () => {
  const setIsActivPostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );
  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );
  const navigate = useNavigate();

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PopupLayout
          onClose={() => setIsActivePostComposeBySourceUrlPopup(false)}
          isTouchScrollBar={false}
          hasTransparentOverLay={true}
          headerBorderRadiusNum={0}
        >
          <PostComposeBySourceUrlPopupBody
            bottomNextButtonActionFunc={() => navigate(POST_COMPOSE_PATH)}
          />
        </PopupLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          popupWrapStyle={{
            height: 'calc(100vh - 50px)',
            borderRadius: '20px',
          }}
          onClose={() => setIsActivePostComposeBySourceUrlPopup(false)}
        >
          <PostComposeBySourceUrlPopupBody
            bottomNextButtonActionFunc={() => {
              setIsActivePostComposeBySourceUrlPopup(false);
              setIsActivPostComposePopup(true);
            }}
          />
        </RoundSquareCenterPopupLayout>
      )}
    </>
  );
};

export default PostComposeBySourceUrlPopup;
