import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import {
  isActiveProfileScarpTargetAudPopupAtom,
  scrapTargetAudienceAtom,
} from 'states/ProfileAtom';
import ProfileScrapTargetAudiencePopupBody from './ProfileScrapTargetAudiencePopupBody';

const ProfileScrapTargetAudiencePopup: React.FC = () => {
  const [
    isActiveProfileScarpTargetAudPopup,
    setIsActiveProfileScarpTargetAudPopup,
  ] = useRecoilState(isActiveProfileScarpTargetAudPopupAtom);

  const [scrapTargetAudience, setScrapTargetAudience] = useRecoilState(
    scrapTargetAudienceAtom,
  );

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    return () => {
      setIsActiveProfileScarpTargetAudPopup(false);
    };
  }, []);

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
          OverlaySheetStyle={{ zIndex: 2000 }}
          BottomSheetContainerStyle={{ zIndex: 2010 }}
        >
          <ProfileScrapTargetAudiencePopupBody
            targetAudValue={scrapTargetAudience}
            setTargetAudValue={setScrapTargetAudience}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {isActiveProfileScarpTargetAudPopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActiveProfileScarpTargetAudPopup(false)}
              popupOverLayContainerStyle={{ zIndex: 2050 }}
              popupWrapStyle={{ height: '280px', width: '400px' }}
            >
              <ProfileScrapTargetAudiencePopupBody
                targetAudValue={scrapTargetAudience}
                setTargetAudValue={setScrapTargetAudience}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default ProfileScrapTargetAudiencePopup;
