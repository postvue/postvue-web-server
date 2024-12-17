import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import ProfilePostSettingBody from 'components/post/ProfilePostSettingBody';
import { ProfileMyInfo } from 'global/interface/profile';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isSettingPopupAtom } from 'states/PostAtom';
import theme from 'styles/theme';

interface ProfilePostSettingPopupProps {
  myAccountSettingInfo: ProfileMyInfo;
  setIsInterest: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  isBlocked: boolean;
  userId: string;
  username: string;
  isFixed?: boolean;
}

const ProfilePostSettingPopup: React.FC<ProfilePostSettingPopupProps> = ({
  myAccountSettingInfo,
  setIsInterest,
  postId,
  isBlocked,
  userId,
  username,
  isFixed,
}) => {
  const [isSettingActive, setIsSettingActive] =
    useRecoilState(isSettingPopupAtom);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  return (
    <BottomSheetLayout
      isFixed={isFixed}
      isOpen={isSettingActive}
      onClose={() => {
        setIsSettingActive(false);
      }}
      heightNum={300}
      isExternalCloseFunc={isExternalCloseFunc}
      setIsExternalCloseFunc={setIsExternalCloseFunc}
    >
      <ProfilePostSettingBody
        setIsSettingActive={setIsSettingActive}
        myAccountSettingInfo={myAccountSettingInfo}
        setIsInterest={setIsInterest}
        postId={postId}
        isBlocked={isBlocked}
        userId={userId}
        username={username}
        ProfilePostSettingBodyStyle={ProfilePostSettingBodyStyle}
        setIsExternalCloseFunc={setIsExternalCloseFunc}
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
