import anime from 'animejs';
import { QueryStatePostScrapPreviewList } from 'hook/queryhook/QueryStatePostScrapPreviewList';
import React, { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { reactionPostIdAtom } from 'states/PostReactionAtom';
import styled from 'styled-components';
import { PostClipRsp } from '../../../../global/interface/post';
import { createPostToScrap } from '../../../../services/profile/createPostToScrap';
import { deletePostToScrap } from '../../../../services/profile/deletePostToScrap';
import { isActiveScrapViewPopupAtom } from '../../../../states/ProfileAtom';
import ContextMenuPopup from '../../../popups/ContextMenuPopup';
import LongPressToResizeButton from '../LongPressToResizeButton';

import { ReactComponent as PostClipButtonIcon } from 'assets/images/icon/svg/post/PostClipButtonIcon.svg';
import { ReactComponent as PostClipedButtonIcon } from 'assets/images/icon/svg/post/PostClipedButtonIcon.svg';
import { notify } from 'components/popups/ToastMsgPopup';
import { SAVE_POST_TO_SCRAP } from 'const/SystemPhraseConst';
import { refetchProfilePost } from 'global/util/channel/static/refetchProfilePost';
import { refetchScrapPreviewList } from 'global/util/channel/static/refetchScrapPreviewList';
import { sendVibrationHeavyEvent } from 'global/util/reactnative/StackRouter';
import { QueryStateProfileClipListInfinite } from 'hook/queryhook/QueryStateProfileClipListInfinite';
import { QueryStateProfileScrapList } from 'hook/queryhook/QueryStateProfileScrapList';

interface ClipButtonProps {
  setClipStete: (postClipRsp: PostClipRsp) => void;
  postId: string;
  isClipped: boolean;
}

const ClipButton: React.FC<ClipButtonProps> = ({
  setClipStete,
  postId,
  isClipped,
}) => {
  const clipRef = useRef<HTMLDivElement>(null);
  const setSsActiveScrapViewPopup = useSetRecoilState(
    isActiveScrapViewPopupAtom,
  );

  const [isScrapBoardActive, setIsScrapBoardActive] = useState<boolean>(false);

  const {
    data: scrapBoardPreviewList,
    isLoading,
    isFetched,
  } = QueryStatePostScrapPreviewList(postId, isScrapBoardActive);
  const { data: clipList } = QueryStateProfileClipListInfinite();
  const { data: scrapList } = QueryStateProfileScrapList();

  const setReactionPostId = useSetRecoilState(reactionPostIdAtom);

  const onClickClipButton = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    setReactionPostId(postId);
    setIsScrapBoardActive(true);
  };

  const onAddScrap = (scrapId: string) => {
    if (!postId) return;
    createPostToScrap(scrapId, postId)
      .then(async (value) => {
        const postClipRsp: PostClipRsp = {
          isClipped: value.isClipped,
        };

        setClipStete(postClipRsp);

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

        refetchScrapPreviewList(postId);

        refetchProfilePost(postId);

        setIsScrapBoardActive(false);

        notify(SAVE_POST_TO_SCRAP);
      })
      .catch((err) => {
        throw err;
      });
  };

  const onDeleteScrap = (scrapId: string) => {
    if (postId) {
      deletePostToScrap(scrapId, postId)
        .then(async (value) => {
          const postClipRsp: PostClipRsp = {
            isClipped: value.isClipped,
          };
          setClipStete(postClipRsp);

          refetchScrapPreviewList(postId);

          refetchProfilePost(postId);

          setIsScrapBoardActive(false);
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const onClickMoveScrapView = () => {
    setSsActiveScrapViewPopup(true);
    setIsScrapBoardActive(false);
  };

  useEffect(() => {
    if (!isFetched) return;
    if (
      scrapBoardPreviewList === undefined ||
      (scrapBoardPreviewList && scrapBoardPreviewList.length <= 0)
    ) {
      onClickMoveScrapView();
    }
  }, [isFetched]);

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
          setIsActive={setIsScrapBoardActive}
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
            <div>전체 스크랩 보기</div>
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

export default ClipButton;
