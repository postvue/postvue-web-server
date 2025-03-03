import BottomFullScreenSheetLayout from 'components/layouts/BottomFullScreenSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { POST_COMPOSE_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
} from 'states/PostComposeAtom';
import theme from 'styles/theme';
import PostComposeBySourceUrlPopupBody from './PostComposeBySourceUrlPopupBody';
import PostComposeBySourceUrlPopupBottom from './PostComposeBySourceUrlPopupBottom';
import PostComposeBySourceUrlPopupHeader from './PostComposeBySourceUrlPopupHeader';

const PostComposeBySourceUrlPopup: React.FC = () => {
  const setIsActivPostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );
  const [
    isActivePostComposeBySourceUrlPopup,
    setIsActivePostComposeBySourceUrlPopup,
  ] = useRecoilState(isActivPostComposeBySourceUrlPopupAtom);
  const navigate = useNavigate();

  const { windowWidth } = useWindowSize();

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const [postComposeSearchInput, setPostComposeSearchInput] =
    useState<string>('');

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomFullScreenSheetLayout
          isOpen={isActivePostComposeBySourceUrlPopup}
          onClose={() => setIsActivePostComposeBySourceUrlPopup(false)}
          isExternalCloseFunc={isExternalCloseFunc}
          bottomSheetHeaderNode={
            <PostComposeBySourceUrlPopupHeader
              funcPrevButton={() => setIsExternalCloseFunc(true)}
              postComposeSearchInput={postComposeSearchInput}
              setPostComposeSearchInput={setPostComposeSearchInput}
            />
          }
          BottomSheetBottomNode={
            <PostComposeBySourceUrlPopupBottom
              bottomNextButtonActionFunc={() => {
                setIsActivePostComposeBySourceUrlPopup(false);
                navigate(POST_COMPOSE_PATH);
              }}
              PostComposeBySourceUrlPopupBottomStyle={{
                position: 'fixed',
                maxWidth: theme.systemSize.appDisplaySize.maxWidth,
              }}
            />
          }
        >
          <PostComposeBySourceUrlPopupBody
            postComposeSearchInput={postComposeSearchInput}
          />
        </BottomFullScreenSheetLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          popupWrapStyle={{
            height: 'calc(100dvh - 50px)',
            borderRadius: '20px',
          }}
          onClose={() => setIsActivePostComposeBySourceUrlPopup(false)}
        >
          <PostComposeBySourceUrlPopupHeader
            funcPrevButton={() => setIsActivePostComposeBySourceUrlPopup(false)}
            postComposeSearchInput={postComposeSearchInput}
            setPostComposeSearchInput={setPostComposeSearchInput}
          />
          <PostComposeBySourceUrlPopupBody
            postComposeSearchInput={postComposeSearchInput}
          />
          <PostComposeBySourceUrlPopupBottom
            bottomNextButtonActionFunc={() => {
              setIsActivePostComposeBySourceUrlPopup(false);
              setIsActivPostComposePopup(true);
            }}
          />
        </RoundSquareCenterPopupLayout>
      )}
    </>
  );
};

export default PostComposeBySourceUrlPopup;
