import {
  sendNativeVideoGalleryUploadEvent,
  sendNativeVideShootUploadEvent,
} from 'global/util/reactnative/nativeRouter';
import React from 'react';
import styled from 'styled-components';

interface PostVideoComposeSelectTypePopupBodyProps {
  onClose: () => void;
}

const PostVideoComposeSelectTypePopupBody: React.FC<
  PostVideoComposeSelectTypePopupBodyProps
> = ({ onClose }) => {
  const videeUploadTypeTabList = [
    { tabName: '촬영', tabId: 1, func: sendNativeVideShootUploadEvent },
    { tabName: '갤러리', tabId: 2, func: sendNativeVideoGalleryUploadEvent },
  ];
  return (
    <PostComposeTargetHeaderContainer>
      <PostComposeTarAudTitle>
        <PostComposeTargetHeaderTitle>업로드 유형</PostComposeTargetHeaderTitle>
        <TagPopupCloseButton
          onClick={() => {
            onClose();
          }}
        >
          닫기
        </TagPopupCloseButton>
      </PostComposeTarAudTitle>
      <PostComposeTargetBodyContainer>
        {videeUploadTypeTabList.map((value, key) => (
          <PostComposeTargetWrap
            key={key}
            onClick={() => {
              onClose();
              value.func();
            }}
          >
            <PostComposeTargetAudienceTab>
              {value.tabName}
            </PostComposeTargetAudienceTab>
          </PostComposeTargetWrap>
        ))}
      </PostComposeTargetBodyContainer>
    </PostComposeTargetHeaderContainer>
  );
};

const PostComposeTargetHeaderContainer = styled.div`
  flex: 1;
`;

const PostComposeTarAudTitle = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.systemSize.header.height};
`;

const PostComposeTargetHeaderTitle = styled.div`
  left: 50%;
  transform: translate(-50%, 0%);
  position: absolute;

  margin: auto;

  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const PostComposeTargetBodyContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 30px;
`;

const PostComposeTargetWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  cursor: pointer;
`;

const PostComposeTargetAudienceTab = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  font-size: 18px;
`;

const TagPopupCloseButton = styled.div`
  position: absolute;
  font: ${({ theme }) => theme.fontSizes.Body4};
  right: 0px;
  cursor: pointer;
  margin-right: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bothSidePadding};
  z-index: 100;
`;

export default PostVideoComposeSelectTypePopupBody;
