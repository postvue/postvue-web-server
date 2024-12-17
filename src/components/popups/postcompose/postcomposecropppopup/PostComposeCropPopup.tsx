import PopupLayout from 'components/layouts/PopupLayout';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { PostUploadContent } from 'global/interface/post';
import { isValidString } from 'global/util/ValidUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { SetterOrUpdater } from 'recoil';
import styled from 'styled-components';
import PostComposeCropPopupBody from './PostComposeCropPopupBody';

interface PostComposeCropPopupProps {
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  showCropper: boolean;
  setShowCropper: React.Dispatch<React.SetStateAction<boolean>>;
  setPostUploadContentList: SetterOrUpdater<PostUploadContent[]>;
}
const PostComposeCropPopup: React.FC<PostComposeCropPopupProps> = ({
  imageUrl,
  setImageUrl,
  showCropper,
  setShowCropper,
  setPostUploadContentList,
}) => {
  const { windowWidth } = useWindowSize();

  return (
    <>
      {imageUrl && isValidString(imageUrl) && showCropper && (
        <>
          {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
            <RoundSquareCenterPopupLayout
              onClose={() => setShowCropper(false)}
              popupWrapStyle={{ maxWidth: '550px', height: '80%' }}
              hasFixedActive={false}
            >
              <PostComposeCropPopupBody
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setShowCropper={setShowCropper}
                setPostUploadContentList={setPostUploadContentList}
              />
            </RoundSquareCenterPopupLayout>
          ) : (
            // <BottomSheetLayout
            //   isOpen={showCropper && isValidString(imageUrl)}
            //   onClose={() => {
            //     setShowCropper(false);
            //     setImageUrl('');
            //   }}
            //   heightNum={300}
            //   isAvaliScroll={false}
            // >
            //   <PostComposeCropPopupBody
            //     imageUrl={imageUrl}
            //     setImageUrl={setImageUrl}
            //     setShowCropper={setShowCropper}
            //     setPostUploadContentList={setPostUploadContentList}
            //   />
            // </BottomSheetLayout>
            <PopupLayout
              onClose={() => {
                setShowCropper(false);
                setImageUrl('');
              }}
              isTouchScrollBar={false}
              popupOverLayContainerStyle={{ borderRadius: '0px' }}
              hasTransparentOverLay={true}
              hasFixedActive={false}
              popupWrapStyle={{ borderRadius: '0px' }}
            >
              <PrevButtonHeaderHeader
                titleName="사진 편집"
                isActionFunc={true}
                actionFunc={() => {
                  setShowCropper(false);
                  setImageUrl('');
                }}
                preNodeByState={<CropCloseButton>닫기</CropCloseButton>}
              />
              <PostComposeCropPopupBody
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setShowCropper={setShowCropper}
                setPostUploadContentList={setPostUploadContentList}
              />
            </PopupLayout>
          )}
        </>
      )}
    </>
  );
};

const CropCloseButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  padding: 5px;
`;

export default PostComposeCropPopup;
