import { QueryMutationDeletePostComment } from 'hook/queryhook/QueryMutationDeletePostComment';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import {
  activePostCommentComplaintPopupAtom,
  postBlockedUserInfoAtom,
} from 'states/PostAtom';
import { isActiveProfileBlockPopupAtom } from 'states/ProfileAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';
import ContextMenuPopup from '../../ContextMenuPopup';

interface PostReactionCommentSettingContextPopupProps {
  postCommentSettingRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  postId: string;
  userId: string;
  username: string;
  commentId: string;
}

const PostReactionCommentSettingContextPopup: React.FC<
  PostReactionCommentSettingContextPopupProps
> = ({
  postId,
  userId,
  commentId,
  username,
  postCommentSettingRef,
  onClose,
}) => {
  const { data: myAccountSettingInfo } = QueryStateMyProfileInfo();

  const deletePostCommentQuery = QueryMutationDeletePostComment();
  const setIsLoadingPopup = useSetRecoilState(isLoadingPopupAtom);
  const onClickDeletePostComment = (commentId: string) => {
    setIsLoadingPopup(true);
    setTimeout(() => {
      deletePostCommentQuery.mutate({ commentId });
      setIsLoadingPopup(false);
    }, 500);
  };

  const setIsActiveProfileBlock = useSetRecoilState(
    isActiveProfileBlockPopupAtom,
  );

  const setPostBlockedUserInfo = useSetRecoilState(postBlockedUserInfoAtom);

  const setActivePostCommentComplaintPopup = useSetRecoilState(
    activePostCommentComplaintPopupAtom,
  );

  return (
    <>
      {postCommentSettingRef.current && (
        <ContextMenuPopup
          contextMenuRef={postCommentSettingRef.current}
          onClose={onClose}
          hasFixedActive={false}
        >
          <PostCommentSettingItemWrap>
            {myAccountSettingInfo?.userId === userId ? (
              <>
                <PostCommentSettingItem
                  onClick={() => onClickDeletePostComment(commentId)}
                >
                  삭제하기
                </PostCommentSettingItem>
                {/* 나중에 추가하기 로 */}
                {/* <PostCommentSettingItem>수정하기</PostCommentSettingItem> */}
              </>
            ) : (
              <>
                <PostCommentSettingItem
                  onClick={() => {
                    onClose();
                    setActivePostCommentComplaintPopup({
                      isActive: true,
                      postId: postId,
                      userId: userId,
                      username: username,
                      commentId: commentId,
                    });
                  }}
                >
                  신고 하기
                </PostCommentSettingItem>
                <PostCommentSettingItem
                  onClick={() => {
                    onClose();
                    setIsActiveProfileBlock(true);
                    setPostBlockedUserInfo({
                      userId: userId,
                      username: username,
                    });
                  }}
                >
                  사용자 차단
                </PostCommentSettingItem>
              </>
            )}
          </PostCommentSettingItemWrap>
        </ContextMenuPopup>
      )}
    </>
  );
};

const PostCommentSettingItemWrap = styled.div``;

const PostCommentSettingItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

export default PostReactionCommentSettingContextPopup;
