import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import ProfilePostSettingBody from 'components/post/ProfilePostSettingBody';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isSettingPopupAtom } from 'states/PostAtom';
import { PostEditType } from 'states/PostComposeAtom';
import theme from 'styles/theme';

interface ProfilePostSettingPopupProps {
  setIsInterest: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  type: PostEditType;
  userId: string;
  username: string;
}

const ProfilePostSettingPopup: React.FC<ProfilePostSettingPopupProps> = ({
  setIsInterest,
  postId,
  type,
  userId,
  username,
}) => {
  const [isSettingActive, setIsSettingActive] =
    useRecoilState(isSettingPopupAtom);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  return (
    <BottomSheetLayout
      isOpen={isSettingActive}
      onClose={() => {
        setIsSettingActive(false);
      }}
      heightNum={
        250 +
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--safe-area-inset-bottom',
            ),
          ) || 0
      }
      isExternalCloseFunc={isExternalCloseFunc}
    >
      <ProfilePostSettingBody
        setIsInterest={setIsInterest}
        postId={postId}
        type={type}
        userId={userId}
        username={username}
        ProfilePostSettingBodyStyle={ProfilePostSettingBodyStyle}
        onClose={() => setIsExternalCloseFunc(true)}
      />
    </BottomSheetLayout>
  );
};

const ProfilePostSettingBodyStyle: React.CSSProperties = {
  bottom: '0',
  height: 'auto',
  width: '100%',
  background: theme.mainColor.White,
  borderRadius: '15px 15px 0 0',
  zIndex: '100',
};

export default ProfilePostSettingPopup;
