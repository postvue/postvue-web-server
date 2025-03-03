import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { activeProfileAccountComplaintPopupAtom } from 'states/ProfileAtom';
import ProfileAccountComplaintPopupBody from './ProfileAccountComplaintPopupBody';

const ProfileAccountComplaintPopup: React.FC = () => {
  const [
    activeProfileAccountComplaintPopup,
    setActiveProfileAccountComplaintPopup,
  ] = useRecoilState(activeProfileAccountComplaintPopupAtom);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSheetLayout
          isOpen={activeProfileAccountComplaintPopup.isActive}
          onClose={() =>
            setActiveProfileAccountComplaintPopup({
              isActive: false,
              userId: '',
              username: '',
            })
          }
          heightNum={
            530 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
          isExternalCloseFunc={isExternalCloseFunc}
        >
          <ProfileAccountComplaintPopupBody
            userId={activeProfileAccountComplaintPopup.userId}
            username={activeProfileAccountComplaintPopup.username}
            setIsExternalCloseFunc={setIsExternalCloseFunc}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {activeProfileAccountComplaintPopup.isActive && (
            <RoundSquareCenterPopupLayout
              onClose={() =>
                setActiveProfileAccountComplaintPopup({
                  isActive: false,
                  userId: '',
                  username: '',
                })
              }
              popupOverLayContainerStyle={{ zIndex: '2000' }}
              popupWrapStyle={{ height: '500px', width: '400px' }}
            >
              <ProfileAccountComplaintPopupBody
                userId={activeProfileAccountComplaintPopup.userId}
                username={activeProfileAccountComplaintPopup.username}
                setIsExternalCloseFunc={setIsExternalCloseFunc}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default ProfileAccountComplaintPopup;
