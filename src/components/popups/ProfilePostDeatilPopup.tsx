import PopupLayout from 'components/layouts/PopupLayout';
import ProfilePostDetail from 'components/post/ProfilePostDetail';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import {
  isPostDetailInfoPopupAtom,
  postDetailInfoPopupAtom,
} from 'states/PostAtom';

const ProfilePostDetailPopup: React.FC = () => {
  const navigate = useNavigate();
  const [postDetailInfoPopup, setPostDetailInfoPopup] = useRecoilState(
    postDetailInfoPopupAtom,
  );

  const [isPostDetailInfoPopup, setIsPostDetailInfoPopup] = useRecoilState(
    isPostDetailInfoPopupAtom,
  );
  const resetPostDetailInfoPopup = useResetRecoilState(postDetailInfoPopupAtom);

  useEffect(() => {
    return () => {
      navigate(-1);
      resetPostDetailInfoPopup();
    };
  }, []);

  return (
    <PopupLayout
      setIsPopup={setIsPostDetailInfoPopup}
      popupWrapStyle={{ borderRadius: '0px' }}
      popupOverLayContainerStyle={{ zIndex: '8' }}
      hasTransparentOverLay={true}
    >
      <ProfilePostDetail
        postId={postDetailInfoPopup.postId}
        userId={postDetailInfoPopup.userId}
      />
    </PopupLayout>
  );
};

export default ProfilePostDetailPopup;
