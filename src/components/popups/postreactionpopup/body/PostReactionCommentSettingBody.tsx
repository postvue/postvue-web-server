import { QueryMutationDeletePostComment } from 'hook/queryhook/QueryMutationDeletePostComment';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { activePostCommentComplaintPopupAtom } from 'states/PostAtom';
import { activeProfileBlockPopupInfoAtom } from 'states/ProfileAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';

interface PostReactionCommentSettingContextPopupProps {
  onClose: () => void;
  postId: string;
  userId: string;
  username: string;
  commentId: string;
}

const PostReactionCommentSettingBody: React.FC<
  PostReactionCommentSettingContextPopupProps
> = ({ postId, userId, commentId, username, onClose }) => {
  const { data: myAccountSettingInfo } = QueryStateMyProfileInfo();

  const deletePostCommentQuery = QueryMutationDeletePostComment();
  const setIsLoadingPopup = useSetRecoilState(isLoadingPopupAtom);
  const onClickDeletePostComment = (commentId: string) => {
    setIsLoadingPopup(true);

    deletePostCommentQuery.mutateAsync({ commentId }).finally(() => {
      setIsLoadingPopup(false);
      onClose();
    });
  };

  const setActiveProfileBlockPopupInfo = useSetRecoilState(
    activeProfileBlockPopupInfoAtom,
  );

  const setActivePostCommentComplaintPopup = useSetRecoilState(
    activePostCommentComplaintPopupAtom,
  );

  return (
    <>
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
                setActiveProfileBlockPopupInfo({
                  isActive: true,
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
    </>
  );
};

const PostCommentSettingItemWrap = styled.div``;

const PostCommentSettingItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

export default PostReactionCommentSettingBody;
