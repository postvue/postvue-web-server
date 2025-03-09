import anime from 'animejs';
import { QueryStatePostScrapPreviewList } from 'hook/queryhook/QueryStatePostScrapPreviewList';
import React, { useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { reactionPostIdAtom } from 'states/PostReactionAtom';
import styled from 'styled-components';
import { createPostToScrap } from '../../../../services/profile/createPostToScrap';
import { deletePostToScrap } from '../../../../services/profile/deletePostToScrap';
import ContextMenuPopup from '../../../popups/ContextMenuPopup';
import LongPressToResizeButton from '../LongPressToResizeButton';

import { queryClient } from 'App';
import { ReactComponent as PostScrapButtonWhiteIcon } from 'assets/images/icon/svg/post/PostClipButton20x20WhiteIcon.svg';
import { ReactComponent as PostClipButtonIcon } from 'assets/images/icon/svg/post/PostClipButtonIcon.svg';
import { ReactComponent as PostClipedButtonIcon } from 'assets/images/icon/svg/post/PostClipedButtonIcon.svg';
import { notify } from 'components/popups/ToastMsgPopup';
import { STATUS_FORBIDDEN_CODE } from 'const/HttpStatusConst';
import { PROFILE_SCRAP_LIST_PATH } from 'const/PathConst';
import { QUERY_STATE_PROFILE_POST } from 'const/QueryClientConst';
import { isMainTab, SCRAP_PAGE_NAME } from 'const/ReactNativeConst';
import { SAVE_POST_TO_SCRAP } from 'const/SystemPhraseConst';
import { onClickClipGlobalState } from 'global/globalstateaction/onClickClipGlobalState';
import { PostRsp } from 'global/interface/post';
import { fetchProfilePost } from 'global/util/channel/static/fetchProfilePost';
import { fetchScrapPreviewList } from 'global/util/channel/static/fetchScrapPreviewList';
import {
  isApp,
  navigateToMainTab,
  navigateToTabWithUrl,
  sendVibrationHeavyEvent,
} from 'global/util/reactnative/nativeRouter';
import { useNavigate } from 'react-router-dom';
import { getPost } from 'services/post/getPost';
import { activeScrapViewPopupInfoAtom } from 'states/ProfileAtom';

interface ClipButtonProps {
  postId: string;
  username: string;
  isClipped: boolean;
  onClickFunc?: () => void;
}

const ClipButton: React.FC<ClipButtonProps> = ({
  postId,
  username,
  isClipped,
  onClickFunc,
}) => {
  const clipRef = useRef<HTMLDivElement>(null);

  const setActiveScrapViewPopupInfo = useSetRecoilState(
    activeScrapViewPopupInfoAtom,
  );

  const setClipButtonState = (isClipped: boolean, newSnsPost: PostRsp) => {
    onClickClipGlobalState(username, postId, isClipped, newSnsPost);
  };

  const [isScrapBoardActive, setIsScrapBoardActive] = useState<boolean>(false);

  const {
    data: scrapBoardPreviewList,
    isLoading,
    isFetched,
  } = QueryStatePostScrapPreviewList(postId, isScrapBoardActive);

  const setReactionPostId = useSetRecoilState(reactionPostIdAtom);
  const navigate = useNavigate();

  const onClickClipButton = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (onClickFunc) {
      onClickFunc();
    }

    setReactionPostId(postId);
    setIsScrapBoardActive(true);
  };

  const onAddScrap = (scrapId: string) => {
    if (!postId) return;
    createPostToScrap(scrapId, postId)
      .then(async (value) => {
        if (value.isClipped) {
          anime({
            targets: clipRef.current,
            scale: [1, 1.5],
            duration: 300,
            easing: 'easeInOutQuad',
            direction: 'alternate',
          });
          sendVibrationHeavyEvent();
        }

        fetchScrapPreviewList(postId);

        const postData = await fetchProfilePost(postId);

        setClipButtonState(value.isClipped, postData);

        setIsScrapBoardActive(false);

        notify({
          msgIcon: <PostScrapButtonWhiteIcon />,
          msgTitle: SAVE_POST_TO_SCRAP,
          autoClose: 3500,
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
        });
      })
      .catch((err) => {
        const data: any = err.response?.data;
        if (err.status === STATUS_FORBIDDEN_CODE) {
          fetchProfilePost(postId);
        }
        alert(data.message);
      });
  };

  const onDeleteScrap = (scrapId: string) => {
    if (postId) {
      deletePostToScrap(scrapId, postId)
        .then(async (value) => {
          fetchScrapPreviewList(postId);

          const postData = await fetchProfilePost(postId);

          setClipButtonState(value.isClipped, postData);

          setIsScrapBoardActive(false);
        })
        .catch((err) => {
          const data: any = err.response?.data;
          if (err.status === STATUS_FORBIDDEN_CODE) {
            fetchProfilePost(postId);
          }
          alert(data.message);
        });
    }
  };

  const onClickMoveScrapView = async () => {
    let post: PostRsp | undefined = queryClient.getQueryData([
      QUERY_STATE_PROFILE_POST,
      postId,
    ]);
    if (!post) {
      post = await getPost(postId);
    }
    setActiveScrapViewPopupInfo({ isActive: true, snsPost: post });
    setIsScrapBoardActive(false);
  };

  return (
    <ClipButtonContainer key={postId}>
      <LongPressToResizeButton resize={0.85} resizeSpeedRate={0.2}>
        <ClipButtonWrap onClick={(e) => onClickClipButton(e)} ref={clipRef}>
          {isClipped ? <PostClipedButtonIcon /> : <PostClipButtonIcon />}
        </ClipButtonWrap>
      </LongPressToResizeButton>
      {isScrapBoardActive && !isLoading && isFetched && clipRef.current && (
        <ContextMenuPopup
          contextMenuRef={clipRef.current}
          onClose={() => setIsScrapBoardActive(false)}
        >
          {scrapBoardPreviewList &&
            scrapBoardPreviewList.map((value, index) => {
              return (
                <React.Fragment key={value.scrapBoardId}>
                  {value.isScraped ? (
                    <ScrapBoardItem
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteScrap(value.scrapBoardId);
                      }}
                    >
                      <div>{value.scrapBoardName}</div>
                      <ScrapBoardRemoveButton>제거</ScrapBoardRemoveButton>
                    </ScrapBoardItem>
                  ) : (
                    <ScrapBoardItem
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddScrap(value.scrapBoardId);
                      }}
                    >
                      <div>{value.scrapBoardName}</div>
                      <ScrapBoardAddButton>추가</ScrapBoardAddButton>
                    </ScrapBoardItem>
                  )}
                </React.Fragment>
              );
            })}
          <ScrapBoardMoveItem
            onClick={(e) => {
              e.stopPropagation();
              onClickMoveScrapView();
            }}
          >
            <div>전체 스크랩</div>
            <div>이동</div>
          </ScrapBoardMoveItem>
        </ContextMenuPopup>
      )}
    </ClipButtonContainer>
  );
};

const ClipButtonContainer = styled.div`
  position: relative;
`;

const ClipButtonWrap = styled.div`
  cursor: pointer;
  display: flex;
`;

const ScrapBoardItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const ScrapBoardAddButton = styled.div``;

const ScrapBoardRemoveButton = styled(ScrapBoardAddButton)`
  color: ${({ theme }) => theme.errorColor.Red};
`;

const ScrapBoardMoveItem = styled(ScrapBoardItem)`
  color: ${({ theme }) => theme.mainColor.Blue};
`;

const PostScrapNotificationGoButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  padding: 0 10px;
  cursor: pointer;
`;

export default ClipButton;
