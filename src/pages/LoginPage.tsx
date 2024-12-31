import { ReactComponent as FeelogMobileLogo } from 'assets/images/icon/svg/logo/FeelogLogo.svg';
import { ACCESS_TOKEN } from 'const/LocalStorageConst';
import { HOME_PATH } from 'const/PathConst';
import {
  CALLBACK_URL,
  FALSE_PARAM,
  IS_APP,
  IS_BACK_BUTTON_IN_LOGIN_PAGE,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { LOGIN_TITLE_PHASE_TEXT } from 'const/SystemPhraseConst';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRefreshToken } from 'services/auth/postRefreshToken';
import styled from 'styled-components';

import { ReactComponent as LoginCancelButtonIcon } from 'assets/images/icon/svg/login/LoginCancelButtonIcon.svg';
import KakaoLoginButton from 'components/common/buttton/login/KakaoLoginButton';
import NaverLoginButton from 'components/common/buttton/login/NaverLoginButton';
import LoginEmailPopup from 'components/popups/signup/LoginEmailPopup';
import SignupEmailPopup from 'components/popups/signup/SignupEmailPopup';
import SignupSendedEmailPopup from 'components/popups/signup/SignupSendedEmailPopup';
import { isApp, stackRouterLogin } from 'global/util/reactnative/StackRouter';

const LoginPage: React.FC = () => {
  const callbackUrl = new URL(window.location.href).searchParams.get(
    CALLBACK_URL,
  );

  const isBackButton =
    (new URL(window.location.href).searchParams.get(
      IS_BACK_BUTTON_IN_LOGIN_PAGE,
    ) || TRUE_PARAM) === TRUE_PARAM
      ? true
      : false;

  const isInitAppAuth =
    (new URL(window.location.href).searchParams.get(IS_APP) || FALSE_PARAM) ===
    TRUE_PARAM
      ? true
      : false;

  const navigate = useNavigate();

  const [isView, setIsView] = useState<boolean>(false);

  if (callbackUrl !== null) {
    sessionStorage.setItem(CALLBACK_URL, callbackUrl);
  }

  useEffect(() => {
    if (isInitAppAuth) {
      stackRouterLogin;
    }
    postRefreshToken()
      .then((res) => {
        localStorage.setItem(ACCESS_TOKEN, res.accessToken);
        const url = callbackUrl ? callbackUrl : HOME_PATH;
        if (isApp()) {
          stackRouterLogin(res);
        } else {
          window.location.href = url;
        }
      })
      .catch(() => {
        //@REFER: 출력값 필요하면 넣으삼
        setIsView(true);
      });

    return () => {
      setIsActiveSignupEmailPopup(false);
    };
  }, []);

  const clickDeleteBtn = () => {
    navigate(HOME_PATH);
  };

  const [isActiveSignupEmailPopup, setIsActiveSignupEmailPopup] =
    useState<boolean>(false);

  const [isActiveLoginEmailPopup, setIsActiveLoginEmailPopup] =
    useState<boolean>(false);

  const [isActiveSignupSenedEmailPopup, setIsActiveSignupSenedEmailPopup] =
    useState<boolean>(false);
  const onClickLoginEmail = () => {
    setIsActiveLoginEmailPopup(true);
  };

  const onClose = () => {
    setIsActiveSignupEmailPopup(false);
  };

  return (
    <>
      {isView && (
        <>
          <LoginPageContainer>
            {isBackButton && (
              <LoginCancelButtonIconWrap onClick={clickDeleteBtn}>
                <LoginCancelButtonIcon />
              </LoginCancelButtonIconWrap>
            )}
            <LoginPageLogoWrap>
              <LoginPageLogoIconWrap>
                <LoginPageLogoIconSubWrap>
                  <FeelogMobileLogo />
                </LoginPageLogoIconSubWrap>
              </LoginPageLogoIconWrap>
              <LoginPageLogoTitleWrap>
                <LoginPageLogoTitle>
                  {LOGIN_TITLE_PHASE_TEXT}
                </LoginPageLogoTitle>
              </LoginPageLogoTitleWrap>
            </LoginPageLogoWrap>
            <LoginPageBodyContainer>
              <KakaoLoginButton />
              <NaverLoginButton />
              <EmailLoginButtonWrap onClick={onClickLoginEmail}>
                이메일로 시작하기
              </EmailLoginButtonWrap>
            </LoginPageBodyContainer>
          </LoginPageContainer>
          {isActiveLoginEmailPopup && (
            <LoginEmailPopup
              isOpen={isActiveLoginEmailPopup}
              onClose={() => setIsActiveLoginEmailPopup(false)}
              onOpen={() => {
                setIsActiveLoginEmailPopup(false);
                setIsActiveSignupEmailPopup(true);
              }}
            />
          )}
          {isActiveSignupEmailPopup && (
            <SignupEmailPopup
              onClose={onClose}
              isOpen={isActiveSignupEmailPopup}
              onOpen={() => {
                setIsActiveSignupEmailPopup(false);
                setIsActiveSignupSenedEmailPopup(true);
              }}
            />
          )}
          {isActiveSignupSenedEmailPopup && (
            <SignupSendedEmailPopup
              onClose={() => {
                setIsActiveSignupSenedEmailPopup(false);
              }}
            />
          )}
        </>
      )}
    </>
  );
};

const LoginPageContainer = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 58%,
    rgba(0, 0, 0, 0.2) 112%
  );
  height: 100%;
`;

const LoginPageLogoWrap = styled.div`
  position: fixed;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
`;

const LoginPageLogoIconWrap = styled.div`
  display: flex;
`;

const LoginPageLogoIconSubWrap = styled.div`
  margin: 0 auto;
`;

const LoginPageLogoTitleWrap = styled.div``;

const LoginPageLogoTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const LoginPageBodyContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 10px;

  position: fixed;
  width: 100%;
  bottom: 0px;
  padding: 30px 0px 52px 0px;
  left: 50%;
  transform: translate(-50%, 0px);

  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
`;

const EmailLoginButtonWrap = styled.div`
  text-align: center;
  padding: 14px 0;
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey4};
  cursor: pointer;
`;

const LoginCancelButtonIconWrap = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  margin: 10px 10px 0 0;
  z-index: 100;
  cursor: pointer;

  margin: 20px 20px 0 0;
`;

export default LoginPage;
