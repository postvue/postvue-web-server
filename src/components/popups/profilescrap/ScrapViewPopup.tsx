import BottomSnapSheetLayout from 'components/layouts/BottomSnapSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { PostRsp } from 'global/interface/post';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect, useState } from 'react';
import { SetterOrUpdater } from 'recoil';
import ScrapViewAddScrapButton from './ScrapViewAddScrapButton';
import ScrapViewHeader from './ScrapViewHeader';
import ScrapViewPopupBody from './ScrapViewPopupBody';

interface ScrapViewPopupProps {
  snsPost: PostRsp;
  setSnsPost: SetterOrUpdater<PostRsp>;
  postId: string;
  postContentUrl: string;
  postContentType: string;
  isActiveScrapViewPopup: boolean;
  setIsActiveScrapViewPopup: SetterOrUpdater<boolean>;
  isFixed?: boolean;
}

const ScrapViewPopup: React.FC<ScrapViewPopupProps> = ({
  snsPost,
  setSnsPost,
  postId,
  postContentType,
  postContentUrl,
  isActiveScrapViewPopup,
  setIsActiveScrapViewPopup,
  isFixed = true,
}) => {
  // 클립 관련 상태 관리

  const [selectedScrapList, setSelectedScrapList] = useState<string[]>([]);

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    return () => {
      setIsActiveScrapViewPopup(false);
    };
  }, []);

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   setIsPopup={setIsActiveScrapViewPopup}
        //   popupWrapStyle={popupWrapStyle}

        // >
        //   <ScrapViewPopupBody
        //     postId={postId}
        //     snsPost={snsPost}
        //     setSnsPost={setSnsPost}
        //     setIsActiveScrapViewPopup={setIsActiveScrapViewPopup}
        //   />
        // </PopupLayout>
        <BottomSnapSheetLayout
          isFixed={isFixed}
          isOpen={isActiveScrapViewPopup}
          onClose={() => setIsActiveScrapViewPopup(false)}
          bottomSheetHeader={
            <ScrapViewHeader
              postId={postId}
              postContentType={postContentType}
              postContentUrl={postContentUrl}
            />
          }
          heightNum={600}
          BottomSheetBottom={
            <ScrapViewAddScrapButton
              postId={postId}
              snsPost={snsPost}
              setSnsPost={setSnsPost}
              setIsActiveScrapViewPopup={setIsActiveScrapViewPopup}
              selectedScrapList={selectedScrapList}
              setSelectedScrapList={setSelectedScrapList}
            />
          }
        >
          <ScrapViewPopupBody
            selectedScrapList={selectedScrapList}
            setSelectedScrapList={setSelectedScrapList}
          />
        </BottomSnapSheetLayout>
      ) : (
        <>
          {isActiveScrapViewPopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActiveScrapViewPopup(false)}
              popupWrapStyle={{ height: '800px', width: '500px' }}
            >
              <ScrapViewHeader
                postId={postId}
                postContentType={postContentType}
                postContentUrl={postContentUrl}
                ScrapViewHeaderContainerStyle={{ flexShrink: '0' }}
              />
              <ScrapViewPopupBody
                selectedScrapList={selectedScrapList}
                setSelectedScrapList={setSelectedScrapList}
                ScrapViewPopupBodyStyle={{ flexGrow: '1', overflow: 'auto' }}
              />
              <ScrapViewAddScrapButton
                postId={postId}
                snsPost={snsPost}
                setSnsPost={setSnsPost}
                setIsActiveScrapViewPopup={setIsActiveScrapViewPopup}
                selectedScrapList={selectedScrapList}
                setSelectedScrapList={setSelectedScrapList}
                ScrapViewAddScrapButtonStyle={{ flexShrink: '0' }}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default ScrapViewPopup;
