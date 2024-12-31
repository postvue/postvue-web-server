import React from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import BottomSnapSheetLayout from 'components/layouts/BottomSnapSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import SnsAnotherSharePoupElement from './snsshare/SnsAnotherSharePoupElement';
import SnsSharePopupBody from './snsshare/SnsSharePopupBody';
import SnsSharePopupHeader from './snsshare/SnsSharePopupHeader';

//@REFER: 태그 관련 상태관리 삭제 하삼

const SnsSharePopup: React.FC = () => {
  const [sharePopupInfo, setSharePopupInfo] =
    useRecoilState(sharePopupInfoAtom);
  const { windowWidth } = useWindowSize();

  const resetSharePopupInfo = useResetRecoilState(sharePopupInfoAtom);

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   setIsPopup={setIsSharePopup}
        //   isTouchScrollBar={true}
        //   popupWrapStyle={PopupWrapStyle}
        //   hasFixedActive={true}
        // >
        //   <SnsShareBody shareLink={shareLink} />
        // </PopupLayout>
        // <Sheet isOpen={isSharePopup} onClose={() => setIsSharePopups(false)}>
        //   <Sheet.Container>
        //     <Sheet.Header />
        //     <Sheet.Content>
        //       {<SnsShareBody shareLink={shareLink} />}
        //     </Sheet.Content>
        //   </Sheet.Container>
        //   <Sheet.Backdrop />
        // </Sheet>
        <>
          {sharePopupInfo.isActive && (
            <BottomSnapSheetLayout
              isOpen={sharePopupInfo.isActive}
              onClose={() =>
                setSharePopupInfo({
                  isActive: false,
                  shareLink: '',
                  mainImageUrl: '',
                  isFixed: false,
                })
              }
              isFixed={sharePopupInfo.isFixed}
              heightNum={700}
              bottomSheetHeader={<SnsSharePopupHeader />}
              BottomSheetBottom={<SnsAnotherSharePoupElement />}
            >
              <SnsSharePopupBody shareLink={sharePopupInfo.shareLink} />
            </BottomSnapSheetLayout>
          )}
        </>
      ) : (
        <>
          {sharePopupInfo.isActive && (
            <RoundSquareCenterPopupLayout
              onClose={() => resetSharePopupInfo()}
              popupWrapStyle={{
                height: '500px',
                width: `${SharePopupBodyHeight}px`,
              }}
            >
              <SnsSharePopupHeader
                SnsSharePopupHeaderStyle={{ flexShrink: '0' }}
              />
              <SnsSharePopupBody
                shareLink={sharePopupInfo.shareLink}
                SnsSharePopupBodyContainerStyle={{
                  overflow: 'auto',
                  flexGrow: '1',
                }}
              />
              <SnsAnotherSharePoupElement
                SnsAnotherSharePoupContainerStyle={{ flexShrink: '0' }}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

const SharePopupBodyHeight = 500;

export default SnsSharePopup;
