import React, { useEffect } from 'react';

import { ScrapThumnailInfo } from 'components/common/body/ProfileScrapThumbnailListView';
import styled from 'styled-components';

interface SelectScrapByComposeButtonProps {
  selectedScrapList: ScrapThumnailInfo[];
  actionFunc: () => void;
  onClose: () => void;
  SelectScrapByComposeButtonStyle?: React.CSSProperties;
}

const SelectScrapByComposeButton: React.FC<SelectScrapByComposeButtonProps> = ({
  selectedScrapList,
  actionFunc,
  onClose,
  SelectScrapByComposeButtonStyle,
}) => {
  const onClickPostToScrapList = () => {
    // createPostToScrapList(postToScrapListReq, postId).then((value) => {
    //   onClose();
    //   onClickClipGlobalState(
    //     snsPost.username,
    //     postId,
    //     !snsPost.isClipped,
    //     snsPost,
    //   );

    //   fetchProfilePost(postId);
    //   notify(SAVE_POST_TO_SCRAP);
    // });
    actionFunc();
  };

  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  return (
    <AddPostToScrapButtonWrap style={SelectScrapByComposeButtonStyle}>
      <AddPostToScrapButton onClick={onClickPostToScrapList}>
        {selectedScrapList.length}개 스크랩 선택
      </AddPostToScrapButton>
    </AddPostToScrapButtonWrap>
  );
};

const ADD_POST_TO_SCRAP_BUTTON_HEIGHT = '96px';

const AddPostToScrapButtonWrap = styled.div`
  height: ${ADD_POST_TO_SCRAP_BUTTON_HEIGHT};
  bottom: 0px;
  left: 0;
  right: 0px;
  margin: 0 auto;
  width: 100%;
  text-align: center;
`;

const AddPostToScrapButton = styled.div`
  padding: 14px 0;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  color: ${({ theme }) => theme.mainColor.White};
  background-color: ${({ theme }) => theme.mainColor.Blue};
  border-radius: 8px;
  margin: 13px 20px 33px 20px;
  cursor: pointer;
`;

const AddPostToScrapNotActiveButton = styled(AddPostToScrapButton)`
  background-color: ${({ theme }) => theme.grey.Grey3};
  opacity: 0.4;
  color: ${({ theme }) => theme.mainColor.Black};
  cursor: auto;
`;

export default SelectScrapByComposeButton;
