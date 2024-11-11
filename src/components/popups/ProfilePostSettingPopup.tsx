import PopupLayout from 'components/layouts/PopupLayout';
import ProfilePostSettingBody from 'components/post/ProfilePostSettingBody';
import { ProfileMyInfo } from 'global/interface/profile';
import React from 'react';
import theme from 'styles/theme';

interface ProfilePostSettingPopupProps {
  setIsSettingActive: React.Dispatch<React.SetStateAction<boolean>>;
  myAccountSettingInfo: ProfileMyInfo;
  setIsInterest: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  isBlocked: boolean;
  userId: string;
  username: string;
}

const ProfilePostSettingPopup: React.FC<ProfilePostSettingPopupProps> = ({
  setIsSettingActive,
  myAccountSettingInfo,
  setIsInterest,
  postId,
  isBlocked,
  userId,
  username,
}) => {
  return (
    <>
      <PopupLayout
        setIsPopup={setIsSettingActive}
        popupWrapStyle={{ height: 'auto' }}
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
        />
      </PopupLayout>
    </>
  );
};

const ProfilePostSettingBodyStyle: React.CSSProperties = {
  bottom: '0',
  height: 'auto',
  marginTop: '50px',
  paddingBottom: '50px',
  width: '100%',
  background: theme.mainColor.White,
  borderRadius: '15px 15px 0 0',
  zIndex: '100',
};

export default ProfilePostSettingPopup;
