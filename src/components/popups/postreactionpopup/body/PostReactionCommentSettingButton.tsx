import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { commentSettingPopupInfoAtom } from 'states/PostAtom';
import styled from 'styled-components';
import PostReactionCommentSettingContextPopup from './PostReactionCommentSettingContextPopup';

interface PostReactionCommentSettingButtonProps {
  postId: string;
  userId: string;
  username: string;
  commentId: string;
}

const PostReactionCommentSettingButton: React.FC<
  PostReactionCommentSettingButtonProps
> = ({ postId, userId, commentId, username }) => {
  const postCommentSettingRef = useRef<HTMLDivElement>(null);

  const { windowWidth } = useWindowSize();

  const [isCommentSettingContextMenu, setIsCommentSettingContextMenu] =
    useState<boolean | string>(false);

  const [commentSettingPopupInfo, setCommentSettingPopupInfo] = useRecoilState(
    commentSettingPopupInfoAtom,
  );

  const onClickSettingContextMenu = (postIdIndex: string) => {
    if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
      setIsCommentSettingContextMenu(postIdIndex);
    } else {
      setCommentSettingPopupInfo({
        isActive: true,
        postId: postId,
        userId: userId,
        username: username,
        commentId: commentId,
      });
    }
  };

  return (
    <PostCommentSettingButtonContainer
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <PostCommentSettingWrap
        ref={postCommentSettingRef}
        onClick={() => onClickSettingContextMenu(postId)}
      >
        <PostCommentSettingIcon
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4.5 12C4.5 12.2652 4.60536 12.5196 4.79289 12.7071C4.98043 12.8946 5.23478 13 5.5 13C5.76522 13 6.01957 12.8946 6.20711 12.7071C6.39464 12.5196 6.5 12.2652 6.5 12C6.5 11.7348 6.39464 11.4804 6.20711 11.2929C6.01957 11.1054 5.76522 11 5.5 11C5.23478 11 4.98043 11.1054 4.79289 11.2929C4.60536 11.4804 4.5 11.7348 4.5 12Z"
            fill="#9199A1"
          />
          <path
            d="M10.9999 12C10.9999 12.2652 11.1053 12.5196 11.2928 12.7071C11.4804 12.8946 11.7347 13 11.9999 13C12.2651 13 12.5195 12.8946 12.707 12.7071C12.8946 12.5196 12.9999 12.2652 12.9999 12C12.9999 11.7348 12.8946 11.4804 12.707 11.2929C12.5195 11.1054 12.2651 11 11.9999 11C11.7347 11 11.4804 11.1054 11.2928 11.2929C11.1053 11.4804 10.9999 11.7348 10.9999 12Z"
            fill="#9199A1"
          />
          <path
            d="M17.5 12C17.5 12.2652 17.6054 12.5196 17.7929 12.7071C17.9804 12.8946 18.2348 13 18.5 13C18.7652 13 19.0196 12.8946 19.2071 12.7071C19.3946 12.5196 19.5 12.2652 19.5 12C19.5 11.7348 19.3946 11.4804 19.2071 11.2929C19.0196 11.1054 18.7652 11 18.5 11C18.2348 11 17.9804 11.1054 17.7929 11.2929C17.6054 11.4804 17.5 11.7348 17.5 12Z"
            fill="#9199A1"
          />
          <path
            d="M4.5 12C4.5 12.2652 4.60536 12.5196 4.79289 12.7071C4.98043 12.8946 5.23478 13 5.5 13C5.76522 13 6.01957 12.8946 6.20711 12.7071C6.39464 12.5196 6.5 12.2652 6.5 12C6.5 11.7348 6.39464 11.4804 6.20711 11.2929C6.01957 11.1054 5.76522 11 5.5 11C5.23478 11 4.98043 11.1054 4.79289 11.2929C4.60536 11.4804 4.5 11.7348 4.5 12Z"
            stroke="#9199A1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.9999 12C10.9999 12.2652 11.1053 12.5196 11.2928 12.7071C11.4804 12.8946 11.7347 13 11.9999 13C12.2651 13 12.5195 12.8946 12.707 12.7071C12.8946 12.5196 12.9999 12.2652 12.9999 12C12.9999 11.7348 12.8946 11.4804 12.707 11.2929C12.5195 11.1054 12.2651 11 11.9999 11C11.7347 11 11.4804 11.1054 11.2928 11.2929C11.1053 11.4804 10.9999 11.7348 10.9999 12Z"
            stroke="#9199A1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 12C17.5 12.2652 17.6054 12.5196 17.7929 12.7071C17.9804 12.8946 18.2348 13 18.5 13C18.7652 13 19.0196 12.8946 19.2071 12.7071C19.3946 12.5196 19.5 12.2652 19.5 12C19.5 11.7348 19.3946 11.4804 19.2071 11.2929C19.0196 11.1054 18.7652 11 18.5 11C18.2348 11 17.9804 11.1054 17.7929 11.2929C17.6054 11.4804 17.5 11.7348 17.5 12Z"
            stroke="#9199A1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </PostCommentSettingIcon>
      </PostCommentSettingWrap>
      {isCommentSettingContextMenu !== false &&
        isCommentSettingContextMenu === postId && (
          <PostReactionCommentSettingContextPopup
            postCommentSettingRef={postCommentSettingRef}
            postId={postId}
            userId={userId}
            username={username}
            onClose={() => setIsCommentSettingContextMenu(false)}
            commentId={commentId}
          />
        )}
    </PostCommentSettingButtonContainer>
  );
};

const PostCommentSettingButtonContainer = styled.div`
  position: relative;
`;

const PostCommentSettingWrap = styled.div`
  cursor: pointer;
`;

const PostCommentSettingIcon = styled.svg``;

export default PostReactionCommentSettingButton;
