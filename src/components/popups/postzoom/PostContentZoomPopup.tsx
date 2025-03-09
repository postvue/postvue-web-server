import React, { useEffect, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { postContentZoomPopupInfoAtom } from 'states/PostAtom';

import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import PostContentZoomMobilePopup from './PostContentZoomMobilePopup';
import PostContentZoomPcPopup from './PostContentZoomPcPopup';
import PostContentZooomSwiper from './PostContentZoomSwiper';

const PostCotentZoomPopup: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
          setCurrentIndex={setCurrentIndex}
          contentLength={postContentZoomPopupInfo.postContents.length}
        >
          <PostContentZooomSwiper
            postContents={postContentZoomPopupInfo.postContents}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            initIndex={postContentZoomPopupInfo.initIndex}
            isActive={postContentZoomPopupInfo.isActive}
            isMobile={false}
          />
        </PostContentZoomPcPopup>
      ) : (
        <PostContentZoomMobilePopup
          isOpen={postContentZoomPopupInfo.isActive}
          onClose={() => resetPostContentZoomPopupInfo()}
          currentIndex={currentIndex}
          contentLength={postContentZoomPopupInfo.postContents.length}
          isExternalCloseFunc={isExternalCloseFunc}
          setIsExternalCloseFunc={setIsExternalCloseFunc}
        >
          <PostContentZooomSwiper
            postContents={postContentZoomPopupInfo.postContents}
            currentIndex={currentIndex}
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
