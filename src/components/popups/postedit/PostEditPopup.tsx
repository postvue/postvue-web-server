import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import React from 'react';
import { useRecoilState } from 'recoil';
import { postEditActiveInfoPopupAtom } from 'states/PostComposeAtom';
import PostEditPageBody from './PostEditPageBody';

interface PostComposePopupProps {
  postId: string;
}

const PostEditPopup: React.FC<PostComposePopupProps> = ({ postId }) => {
  const [postEditActiveInfoPopup, setPostEditActiveInfoPopup] = useRecoilState(
    postEditActiveInfoPopupAtom,
  );
  const onCloase = () => {
    setPostEditActiveInfoPopup({
      postId: '',
      isActive: false,
    });
  };

  return (
    <>
      <RoundSquareCenterPopupLayout
        onClose={onCloase}
        popupWrapStyle={{ height: '90%' }}
        isCloseByOverlay={false}
      >
        <PostEditPageBody
          postId={postId}
          hasTransparentOverLay={true}
          hasPrevButton={false}
          actionFuncByCompose={() => onCloase()}
          onClose={onCloase}
        />
      </RoundSquareCenterPopupLayout>
      {postEditActiveInfoPopup.isActive && <MyAccountSettingInfoState />}
    </>
  );
};

export default PostEditPopup;
