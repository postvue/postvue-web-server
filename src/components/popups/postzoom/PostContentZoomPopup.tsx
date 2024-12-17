import React, { useEffect, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { postContentZoomPopupInfoAtom } from 'states/PostAtom';

import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { PostRsp } from 'global/interface/post';
import useWindowSize from 'hook/customhook/useWindowSize';
import PostContentZoomMobilePopup from './PostContentZoomMobilePopup';
import PostContentZoomPcPopup from './PostContentZoomPcPopup';
import PostContentZooomSwiper from './PostContentZoomSwiper';

interface PostCotentZoomPopupProps {
  snsPost: PostRsp;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isFixed?: boolean;
}

const PostCotentZoomPopup: React.FC<PostCotentZoomPopupProps> = ({
  snsPost,
  currentIndex,
  setCurrentIndex,
  isFixed = true,
}) => {
  const resetPostContentZoomPopupInfo = useResetRecoilState(
    postContentZoomPopupInfoAtom,
  );

  const postContentZoomPopupInfo = useRecoilValue(postContentZoomPopupInfoAtom);

  const { windowWidth } = useWindowSize();

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  useEffect(() => {
    return () => {
      resetPostContentZoomPopupInfo();
    };
  }, []);

  return (
    <>
      {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM &&
      postContentZoomPopupInfo.isActive ? (
        <PostContentZoomPcPopup
          isActive={postContentZoomPopupInfo.isActive}
          currentIndex={currentIndex}
          contentLength={snsPost.postContents.length}
        >
          <PostContentZooomSwiper
            snsPost={snsPost}
            setCurrentIndex={setCurrentIndex}
            initIndex={postContentZoomPopupInfo.initIndex}
            isActive={postContentZoomPopupInfo.isActive}
            isMobile={false}
          />
        </PostContentZoomPcPopup>
      ) : (
        <PostContentZoomMobilePopup
          isFixed={isFixed}
          isOpen={postContentZoomPopupInfo.isActive}
          onClose={() => resetPostContentZoomPopupInfo()}
          currentIndex={currentIndex}
          contentLength={snsPost.postContents.length}
          isExternalCloseFunc={isExternalCloseFunc}
          setIsExternalCloseFunc={setIsExternalCloseFunc}
        >
          <PostContentZooomSwiper
            snsPost={snsPost}
            setCurrentIndex={setCurrentIndex}
            initIndex={postContentZoomPopupInfo.initIndex}
            isActive={postContentZoomPopupInfo.isActive}
            isMobile={true}
          />
        </PostContentZoomMobilePopup>
      )}
    </>
  );
};

export default PostCotentZoomPopup;
