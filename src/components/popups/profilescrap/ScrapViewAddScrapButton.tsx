import React, { useEffect } from 'react';
import { createPostToScrapList } from 'services/profile/createPostToScrapList';

import { SAVE_POST_TO_SCRAP } from 'const/SystemPhraseConst';
import { onClickClipGlobalState } from 'global/globalstateaction/onClickClipGlobalState';
import { PostRsp } from 'global/interface/post';
import { PostToScrapListReq } from 'global/interface/profile';
import { SetterOrUpdater } from 'recoil';
import styled from 'styled-components';
import { notify } from '../ToastMsgPopup';

interface ScrapViewAddScrapButtonProps {
  snsPost: PostRsp;
  setSnsPost: SetterOrUpdater<PostRsp>;
  postId: string;
  selectedScrapList: string[];
  setSelectedScrapList: React.Dispatch<React.SetStateAction<string[]>>;
  setIsActiveScrapViewPopup: SetterOrUpdater<boolean>;
  ScrapViewAddScrapButtonStyle?: React.CSSProperties;
}

const ScrapViewAddScrapButton: React.FC<ScrapViewAddScrapButtonProps> = ({
  selectedScrapList,
  snsPost,
  setSnsPost,
  postId,
  setIsActiveScrapViewPopup,
  ScrapViewAddScrapButtonStyle,
}) => {
  const onClickPostToScrapList = () => {
    const postToScrapListReq: PostToScrapListReq = {
      scrapIdList: selectedScrapList,
    };
    createPostToScrapList(postToScrapListReq, postId).then((value) => {
      setIsActiveScrapViewPopup(false);
      onClickClipGlobalState(
        snsPost.username,
        postId,
        !snsPost.isClipped,
        snsPost,
      );
      setSnsPost((prev) => ({ ...prev, isClipped: value.isClipped }));
      notify(SAVE_POST_TO_SCRAP);
    });
  };

  useEffect(() => {
    return () => {
      setIsActiveScrapViewPopup(false);
    };
  }, []);

  return (
    <AddPostToScrapButtonWrap style={ScrapViewAddScrapButtonStyle}>
      {selectedScrapList.length > 0 ? (
        <AddPostToScrapButton onClick={onClickPostToScrapList}>
          {selectedScrapList.length}개 스크랩 선택 완료
        </AddPostToScrapButton>
      ) : (
        <AddPostToScrapNotActiveButton>
          0개 스크랩 선택
        </AddPostToScrapNotActiveButton>
      )}
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

export default ScrapViewAddScrapButton;
