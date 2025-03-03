import { ScrapThumnailInfo } from 'components/common/body/ProfileScrapThumbnailListView';
import BottomSnapSheetLayout from 'components/layouts/BottomSnapSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { PostRsp } from 'global/interface/post';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { activeScrapViewPopupInfoAtom } from 'states/ProfileAtom';
import ScrapViewAddScrapButton from './ScrapViewAddScrapButton';
import ScrapViewHeader from './ScrapViewHeader';
import ScrapViewPopupBody from './ScrapViewPopupBody';

interface ScrapViewPopupProps {
  snsPost: PostRsp;
}

const ScrapViewPopup: React.FC<ScrapViewPopupProps> = ({ snsPost }) => {
  // 클립 관련 상태 관리
  const activeScrapViewPopupInfo = useRecoilValue(activeScrapViewPopupInfoAtom);

  const resetActiveScrapViewPopupInfo = useResetRecoilState(
    activeScrapViewPopupInfoAtom,
  );

  const [selectedScrapList, setSelectedScrapList] = useState<
    ScrapThumnailInfo[]
  >([]);

  const { windowWidth } = useWindowSize();

  const onClose = () => {
    resetActiveScrapViewPopupInfo();
  };

  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSnapSheetLayout
          isOpen={activeScrapViewPopupInfo.isActive}
          onClose={onClose}
          isExternalCloseFunc={isExternalCloseFunc}
          bottomSheetHeader={
            <ScrapViewHeader
              postId={snsPost.postId}
              postContentType={snsPost.postContents[0].postContentType}
              postContentUrl={
                snsPost.postContents[0].postContentType === POST_IMAGE_TYPE
                  ? snsPost.postContents[0].content
                  : snsPost.postContents[0].previewImg
              }
            />
          }
          heightNum={600}
          BottomSheetBottom={
            <ScrapViewAddScrapButton
              postId={snsPost.postId}
              snsPost={snsPost}
              onClose={() => setIsExternalCloseFunc(true)}
              selectedScrapList={selectedScrapList}
            />
          }
        >
          <ScrapViewPopupBody
            selectedScrapList={selectedScrapList}
            setSelectedScrapList={setSelectedScrapList}
            ScrapViewPopupBodyStyle={{
              position: 'relative',
              height: '100%',
              minHeight: 'auto',
            }}
          />
        </BottomSnapSheetLayout>
      ) : (
        <>
          <RoundSquareCenterPopupLayout
            onClose={onClose}
            popupWrapStyle={{ height: '800px', maxWidth: '550px' }}
          >
            <ScrapViewHeader
              postId={snsPost.postId}
              postContentType={snsPost.postContents[0].postContentType}
              postContentUrl={
                snsPost.postContents[0].postContentType === POST_IMAGE_TYPE
                  ? snsPost.postContents[0].content
                  : snsPost.postContents[0].previewImg
              }
              ScrapViewHeaderContainerStyle={{ flexShrink: '0' }}
            />
            <ScrapViewPopupBody
              selectedScrapList={selectedScrapList}
              setSelectedScrapList={setSelectedScrapList}
              ScrapViewPopupBodyStyle={{
                flexGrow: '1',
                overflow: 'auto',
                minHeight: 'auto',
              }}
            />
            <ScrapViewAddScrapButton
              postId={snsPost.postId}
              snsPost={snsPost}
              onClose={onClose}
              selectedScrapList={selectedScrapList}
              ScrapViewAddScrapButtonStyle={{
                flexShrink: '0',
              }}
            />
          </RoundSquareCenterPopupLayout>
        </>
      )}
    </>
  );
};

export default ScrapViewPopup;
