import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import React, { useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { commentSettingPopupInfoAtom } from 'states/PostAtom';
import PostReactionCommentSettingBody from './body/PostReactionCommentSettingBody';

const PostReactionCommentSettingPopup: React.FC = () => {
  const [commentSettingPopupInfo, setCommentSettingPopupInfo] = useRecoilState(
    commentSettingPopupInfoAtom,
  );

  const resetCommentSettingPopupInfo = useResetRecoilState(
    commentSettingPopupInfoAtom,
  );

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);
  return (
    <>
      <BottomSheetLayout
        isOpen={commentSettingPopupInfo.isActive}
        onClose={() => resetCommentSettingPopupInfo()}
        isExternalCloseFunc={isExternalCloseFunc}
        heightNum={200}
      >
        <PostReactionCommentSettingBody
          postId={commentSettingPopupInfo.postId}
          userId={commentSettingPopupInfo.userId}
          username={commentSettingPopupInfo.username}
          commentId={commentSettingPopupInfo.commentId}
          onClose={() => setIsExternalCloseFunc(true)}
        />
      </BottomSheetLayout>
    </>
  );
};

export default PostReactionCommentSettingPopup;
