import React from 'react';
import { useRecoilState } from 'recoil';

import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { TargetAudienceInterface } from 'global/interface/profile';
import useWindowSize from 'hook/customhook/useWindowSize';
import { isActiveProfileScarpTargetAudPopupAtom } from 'states/ProfileAtom';
import ProfileScrapTargetAudiencePopupBody from './ProfileScrapTargetAudiencePopupBody';

interface ProfileScrapTargetAudiencePopupProps {
  targetAudValue: TargetAudienceInterface;
  setTargetAudValue: React.Dispatch<
    React.SetStateAction<TargetAudienceInterface>
  >;
}

const ProfileScrapTargetAudiencePopup: React.FC<
  ProfileScrapTargetAudiencePopupProps
> = ({ targetAudValue, setTargetAudValue }) => {
  const [
    isActiveProfileScarpTargetAudPopup,
    setIsActiveProfileScarpTargetAudPopup,
  ] = useRecoilState(isActiveProfileScarpTargetAudPopupAtom);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   setIsPopup={setIsActiveProfileScarpTargetAudPopup}
        //   isTouchScrollBar={true}
        //   popupWrapStyle={popupWrapStyle}
        //   hasFixedActive={false}
        // >
        //   <ProfileScrapTargetAudiencePopupBody
        //     targetAudValue={targetAudValue}
        //     setTargetAudValue={setTargetAudValue}
        //   />
        // </PopupLayout>
        <BottomSheetLayout
          isOpen={isActiveProfileScarpTargetAudPopup}
          onClose={() => setIsActiveProfileScarpTargetAudPopup(false)}
          heightNum={
            220 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
        >
          <ProfileScrapTargetAudiencePopupBody
            targetAudValue={targetAudValue}
            setTargetAudValue={setTargetAudValue}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {isActiveProfileScarpTargetAudPopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActiveProfileScarpTargetAudPopup(false)}
              popupWrapStyle={{ height: '280px', width: '400px' }}
            >
              <ProfileScrapTargetAudiencePopupBody
                targetAudValue={targetAudValue}
                setTargetAudValue={setTargetAudValue}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default ProfileScrapTargetAudiencePopup;
