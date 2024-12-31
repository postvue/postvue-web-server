import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import SignupBody from 'components/signup/SignupBody';
import { HOME_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';

import React, { useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { getCheckVerificationCode } from 'services/auth/getCheckVerificationCode';
import {
  signStepTransitionInfoAtom,
  signupStepNumAtom,
} from 'states/SignupAtom';
import { createGlobalStyle } from 'styled-components';

const SignupPage: React.FC = () => {
  const { windowWidth } = useWindowSize();
  const resetSignupStepNum = useResetRecoilState(signupStepNumAtom);

  useEffect(() => {
    getCheckVerificationCode().catch(() => {
      window.location.href = HOME_PATH;
    });

    return () => {
      resetSignupStepNum();
    };
  }, []);

  const [signStepTransitionInfo, setSignStepTransitionInfo] = useRecoilState(
    signStepTransitionInfoAtom,
  );

  const signupStepNum = useRecoilValue(signupStepNumAtom);

  return (
    <>
      <GlobalStyle />
      {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <RoundSquareCenterPopupLayout
          onClose={() => {
            ('');
          }}
        >
          <SignupBody />
        </RoundSquareCenterPopupLayout>
      ) : (
        <TransitionGroup>
          <CSSTransition
            in={signStepTransitionInfo.inTransition}
            key={signupStepNum}
            timeout={300}
            classNames={{
              enter:
                signStepTransitionInfo.direction === 'left'
                  ? 'slide-enter-left'
                  : 'slide-enter-right',
              enterActive:
                signStepTransitionInfo.direction === 'left'
                  ? 'slide-enter-left-active'
                  : 'slide-enter-right-active',
              exit:
                signStepTransitionInfo.direction === 'left'
                  ? 'slide-exit-left'
                  : 'slide-exit-right',
              exitActive:
                signStepTransitionInfo.direction === 'left'
                  ? 'slide-exit-left-active'
                  : 'slide-exit-right-active',
            }}
            onExited={() =>
              setSignStepTransitionInfo((prev) => ({
                ...prev,
                inTransition: false,
                direction: 'left',
              }))
            } // 애니메이션 종료 후 상태 초기화
          >
            <AppBaseTemplate>
              <SignupBody />
            </AppBaseTemplate>
          </CSSTransition>
        </TransitionGroup>
      )}
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  .slide-enter-left {
    transform: translateX(100%); /* 오른쪽에서 왼쪽으로 들어오는 애니메이션 */
  }

  .slide-enter-left-active {
    transform: translateX(0);
    transition: transform 300ms ease-in-out;
  }

  .slide-enter-right {
    transform: translateX(-100%); /* 왼쪽에서 오른쪽으로 들어오는 애니메이션 */
  }

  .slide-enter-right-active {
    transform: translateX(0);
    transition: transform 300ms ease-in-out;
  }

  .slide-exit-left {
    transform: translateX(0);
  }

  .slide-exit-left-active {
    transform: translateX(-100%);
    transition: transform 300ms ease-in-out;
  }

  .slide-exit-right {
    transform: translateX(0);
  }

  .slide-exit-right-active {
    transform: translateX(100%);
    transition: transform 300ms ease-in-out;
  }
`;

export default SignupPage;
