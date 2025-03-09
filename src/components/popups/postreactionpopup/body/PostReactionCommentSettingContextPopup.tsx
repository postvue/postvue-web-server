import React from 'react';
import ContextMenuPopup from '../../ContextMenuPopup';
import PostReactionCommentSettingBody from './PostReactionCommentSettingBody';

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
  return (
    <>
      {postCommentSettingRef.current && (
        <ContextMenuPopup
          contextMenuRef={postCommentSettingRef.current}
          onClose={onClose}
          hasFixedActive={false}
        >
          <PostReactionCommentSettingBody
            postId={postId}
            userId={userId}
            username={username}
            commentId={commentId}
            onClose={onClose}
          />
        </ContextMenuPopup>
      )}
    </>
  );
};

export default PostReactionCommentSettingContextPopup;
