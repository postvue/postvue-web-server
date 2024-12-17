import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import React from 'react';
import { useRecoilState } from 'recoil';
import { isActivPostComposePopupAtom } from 'states/PostComposeAtom';
import PostComposePageBody from './PostComposePageBody';

const PostComposePopup: React.FC = () => {
  const [isActivPostComposePopup, setIsActivPostComposePopup] = useRecoilState(
    isActivPostComposePopupAtom,
  );

  return (
    <>
      <RoundSquareCenterPopupLayout
        onClose={() => setIsActivPostComposePopup(false)}
        popupWrapStyle={{ height: '90%' }}
        isCloseByOverlay={false}
      >
        <PostComposePageBody
          hasTransparentOverLay={true}
          hasPrevButton={false}
          actionFuncByCompose={() => setIsActivPostComposePopup(false)}
          onClose={() => {
            setIsActivPostComposePopup(false);
          }}
        />
      </RoundSquareCenterPopupLayout>
      {isActivPostComposePopup && <MyAccountSettingInfoState />}
    </>
  );
};

export default PostComposePopup;
