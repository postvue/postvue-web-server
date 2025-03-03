import React, { useEffect } from 'react';
import { createPostToScrapList } from 'services/profile/createPostToScrapList';

import { ReactComponent as PostScrapButtonWhiteIcon } from 'assets/images/icon/svg/post/PostClipButton20x20WhiteIcon.svg';
import { ScrapThumnailInfo } from 'components/common/body/ProfileScrapThumbnailListView';
import { PROFILE_SCRAP_LIST_PATH } from 'const/PathConst';
import { isMainTab, SCRAP_PAGE_NAME } from 'const/ReactNativeConst';
import { SAVE_POST_TO_SCRAP } from 'const/SystemPhraseConst';
import { onClickClipGlobalState } from 'global/globalstateaction/onClickClipGlobalState';
import { PostRsp } from 'global/interface/post';
import { PostToScrapListReq } from 'global/interface/profile';
import { fetchProfilePost } from 'global/util/channel/static/fetchProfilePost';
import {
  isApp,
  navigateToMainTab,
  navigateToTabWithUrl,
} from 'global/util/reactnative/nativeRouter';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { notify } from '../ToastMsgPopup';

interface ScrapViewAddScrapButtonProps {
  snsPost: PostRsp;
  postId: string;
  selectedScrapList: ScrapThumnailInfo[];
  onClose: () => void;
  ScrapViewAddScrapButtonStyle?: React.CSSProperties;
}

const ScrapViewAddScrapButton: React.FC<ScrapViewAddScrapButtonProps> = ({
  selectedScrapList,
  snsPost,
  postId,
  onClose,
  ScrapViewAddScrapButtonStyle,
}) => {
  const navigate = useNavigate();
  const onClickPostToScrapList = () => {
    const postToScrapListReq: PostToScrapListReq = {
      scrapIdList: selectedScrapList.map((v) => v.scrapId),
    };
    createPostToScrapList(postToScrapListReq, postId).then((value) => {
      onClose();
      onClickClipGlobalState(
        snsPost.username,
        postId,
        !snsPost.isClipped,
        snsPost,
      );

      fetchProfilePost(postId);
      notify({
        msgIcon: <PostScrapButtonWhiteIcon />,
        msgTitle: SAVE_POST_TO_SCRAP,
        rightNode: (
          <PostScrapNotificationGoButton
            onClick={() => {
              if (isApp()) {
                if (isMainTab()) {
                  if (location.pathname !== PROFILE_SCRAP_LIST_PATH) {
                    navigateToTabWithUrl(
                      navigate,
                      SCRAP_PAGE_NAME,
                      PROFILE_SCRAP_LIST_PATH,
                    );
                  } else {
                    navigateToMainTab(
                      navigate,
                      SCRAP_PAGE_NAME,
                      PROFILE_SCRAP_LIST_PATH,
                    );
                  }
                }
              } else {
                navigate(PROFILE_SCRAP_LIST_PATH);
              }
            }}
          >
            보기
          </PostScrapNotificationGoButton>
        ),
        autoClose: 3500,
      });
    });
  };

  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  return (
    <AddPostToScrapButtonWrap style={ScrapViewAddScrapButtonStyle}>
      {selectedScrapList.length > 0 ? (
        <AddPostToScrapButton onClick={onClickPostToScrapList}>
          {selectedScrapList.length}개 스크랩 선택
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

const PostScrapNotificationGoButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  padding: 0 10px;
  cursor: pointer;
`;

export default ScrapViewAddScrapButton;
