import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { postEditActiveInfoPopupAtom } from 'states/PostComposeAtom';
import PostEditPageBody from './PostEditPageBody';
import PostVideoEditPageBody from './PostVideoEditPageBody';

interface PostComposePopupProps {
  postId: string;
}

const PostEditPopup: React.FC<PostComposePopupProps> = ({ postId }) => {
  const postEditActiveInfoPopup = useRecoilValue(postEditActiveInfoPopupAtom);

  const resetPostEditActiveInfoPopup = useResetRecoilState(
    postEditActiveInfoPopupAtom,
  );
  const onCloase = () => {
    resetPostEditActiveInfoPopup();
  };

  return (
    <>
      <RoundSquareCenterPopupLayout
        onClose={onCloase}
        popupWrapStyle={{ height: '90%' }}
        isCloseByOverlay={false}
      >
        {postEditActiveInfoPopup.type === 'image' ? (
          <PostEditPageBody
            postId={postId}
            hasTransparentOverLay={true}
            hasPrevButton={false}
            actionFuncByCompose={() => onCloase()}
            onClose={onCloase}
          />
        ) : (
          <PostVideoEditPageBody
            postId={postId}
            hasTransparentOverLay={true}
            hasPrevButton={false}
            actionFuncByCompose={() => onCloase()}
            onClose={onCloase}
          />
        )}
      </RoundSquareCenterPopupLayout>
      {postEditActiveInfoPopup.isActive && <MyAccountSettingInfoState />}
    </>
  );
};

export default PostEditPopup;
