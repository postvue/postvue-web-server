import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import PostComposeBySourceUrlPopupBody from 'components/popups/postcompose/postcomposesourceurlpopup/PostComposeBySourceUrlPopupBody';
import PostComposeBySourceUrlPopupBottom from 'components/popups/postcompose/postcomposesourceurlpopup/PostComposeBySourceUrlPopupBottom';
import PostComposeBySourceUrlPopupHeader from 'components/popups/postcompose/postcomposesourceurlpopup/PostComposeBySourceUrlPopupHeader';
import { HOME_PATH, POST_COMPOSE_PATH } from 'const/PathConst';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import {
  isApp,
  sendInitEvent,
  stackRouterBack,
} from 'global/util/reactnative/nativeRouter';
import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';

const PostComposeBySourceUrlPage: React.FC = () => {
  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);
  const navigate = useNavigate();

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
      return;
    }
    setTimeout(() => {
      sendInitEvent();
    }, 100);
  }, []);

  useBodyAdaptProps([
    { key: 'overscroll-behavior', value: 'none' },
    { key: 'overflow', value: 'hidden' },
  ]);

  return (
    <>
      <PostComposePageBodyContainer>
        <PostComposeBySourceUrlPopupHeader
          funcPrevButton={() => {
            stackRouterBack(navigate);
          }}
          postComposeSearchInput={postComposeSearchInput}
          setPostComposeSearchInput={setPostComposeSearchInput}
          HeaderStyle={{
            paddingTop: `env(safe-area-inset-top)`,
            zIndex: 100,
          }}
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
      </PostComposePageBodyContainer>

      <MyAccountSettingInfoState />
    </>
  );
};

const PostComposePageBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export default PostComposeBySourceUrlPage;
