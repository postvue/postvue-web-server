import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import React from 'react';
import { useRecoilState } from 'recoil';
import { isActivPostVideoComposePopupAtom } from 'states/PostComposeAtom';
import PostComposeVideoPageBody from './PostComposeVideoPageBody';

const PostComposeVideoPopup: React.FC = () => {
  const [isActivPostVideoComposePopup, setIsActivPostVideoComposePopup] =
    useRecoilState(isActivPostVideoComposePopupAtom);

  return (
    <>
      <RoundSquareCenterPopupLayout
        onClose={() => setIsActivPostVideoComposePopup(false)}
        popupWrapStyle={{ height: '90%' }}
        isCloseByOverlay={false}
      >
        <PostComposeVideoPageBody
          hasTransparentOverLay={true}
          hasPrevButton={false}
          actionFuncByCompose={() => setIsActivPostVideoComposePopup(false)}
          onClose={() => {
            setIsActivPostVideoComposePopup(false);
          }}
        />
      </RoundSquareCenterPopupLayout>
      {isActivPostVideoComposePopup && <MyAccountSettingInfoState />}
    </>
  );
};

export default PostComposeVideoPopup;
