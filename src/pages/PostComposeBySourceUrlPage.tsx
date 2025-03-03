import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PostComposeBySourceUrlPopupBody from 'components/popups/postcompose/postcomposesourceurlpopup/PostComposeBySourceUrlPopupBody';
import PostComposeBySourceUrlPopupBottom from 'components/popups/postcompose/postcomposesourceurlpopup/PostComposeBySourceUrlPopupBottom';
import PostComposeBySourceUrlPopupHeader from 'components/popups/postcompose/postcomposesourceurlpopup/PostComposeBySourceUrlPopupHeader';
import { HOME_PATH, POST_COMPOSE_PATH } from 'const/PathConst';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import { isApp, stackRouterBack } from 'global/util/reactnative/nativeRouter';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
} from 'states/PostComposeAtom';

const PostComposeBySourceUrlPage: React.FC = () => {
  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);
  const navigate = useNavigate();
  const { windowWidth } = useWindowSize();

  const setIsActivPostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );
  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );

  const [postComposeSearchInput, setPostComposeSearchInput] =
    useState<string>('');

  useEffect(() => {
    if (!isApp()) {
      goBackOrNavigate();
    }
  }, [windowWidth]);
  return (
    <>
      <AppBaseTemplate
        isAppContainerTopMargin={false}
        isAppInsetTopMargin={false}
      >
        <PostComposeBySourceUrlPopupHeader
          funcPrevButton={() => {
            stackRouterBack(navigate);
          }}
          postComposeSearchInput={postComposeSearchInput}
          setPostComposeSearchInput={setPostComposeSearchInput}
        />
        <PostComposeBySourceUrlPopupBody
          postComposeSearchInput={postComposeSearchInput}
        />
        <PostComposeBySourceUrlPopupBottom
          bottomNextButtonActionFunc={() => {
            if (isApp()) {
              navigate(POST_COMPOSE_PATH);
            } else {
              setIsActivePostComposeBySourceUrlPopup(false);
              setIsActivPostComposePopup(true);
            }
          }}
        />
      </AppBaseTemplate>
      <MyAccountSettingInfoState />
    </>
  );
};

export default PostComposeBySourceUrlPage;
