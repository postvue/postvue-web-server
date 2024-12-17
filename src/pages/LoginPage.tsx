import { ReactComponent as FeelogMobileLogo } from 'assets/images/icon/svg/logo/FeelogLogo.svg';
import { ACCESS_TOKEN } from 'const/LocalStorageConst';
import { HOME_PATH } from 'const/PathConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import { LOGIN_TITLE_PHASE_TEXT } from 'const/SystemPhraseConst';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRefreshToken } from 'services/auth/postRefreshToken';
import styled from 'styled-components';

import { ReactComponent as LoginCancelButtonIcon } from 'assets/images/icon/svg/login/LoginCancelButtonIcon.svg';
import KakaoLoginButton from 'components/common/buttton/login/KakaoLoginButton';
import NaverLoginButton from 'components/common/buttton/login/NaverLoginButton';

const LoginPage: React.FC = () => {
  const callbackUrl = new URL(window.location.href).searchParams.get(
    CALLBACK_URL,
  );
  const navigate = useNavigate();

  if (callbackUrl !== null) {
    sessionStorage.setItem(CALLBACK_URL, callbackUrl);
  }

  useEffect(() => {
    postRefreshToken()
      .then((res) => {
        localStorage.setItem(ACCESS_TOKEN, res.accessToken);
        if (callbackUrl !== null) {
          window.location.href = callbackUrl;
        } else {
          window.location.href = HOME_PATH;
        }
      })
      .catch(() => {
        //@REFER: 출력값 필요하면 넣으삼
      });
  }, []);

  const clickDeleteBtn = () => {
    navigate(HOME_PATH);
  };

  return (
    <LoginPageContainer>
      <LoginCancelButtonIconWrap onClick={clickDeleteBtn}>
        <LoginCancelButtonIcon />
      </LoginCancelButtonIconWrap>
      <LoginPageLogoWrap>
        <LoginPageLogoIconWrap>
          <LoginPageLogoIconSubWrap>
            <FeelogMobileLogo />
          </LoginPageLogoIconSubWrap>
        </LoginPageLogoIconWrap>
        <LoginPageLogoTitleWrap>
          <LoginPageLogoTitle>{LOGIN_TITLE_PHASE_TEXT}</LoginPageLogoTitle>
        </LoginPageLogoTitleWrap>
      </LoginPageLogoWrap>
      <LoginPageBodyContainer>
        <KakaoLoginButton />
        <NaverLoginButton />
        <EmailLoginButtonWrap>이메일로 시작하기</EmailLoginButtonWrap>
      </LoginPageBodyContainer>
    </LoginPageContainer>
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
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  color: ${({ theme }) => theme.mainColor.White};
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
