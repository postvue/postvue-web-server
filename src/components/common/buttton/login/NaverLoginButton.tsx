import { ReactComponent as NaverLoginIcon } from 'assets/images/icon/svg/login/NaverLoginIcon.svg';
import { AxiosError } from 'axios';
import { STATUS_UNAUTHORIZED_CODE } from 'const/HttpStatusConst';
import { NAVER_CALLBACK_URL, NAVER_CLIENT_ID } from 'const/login/NaverConst';
import { HOME_PATH, SIGNUP_PATH } from 'const/PathConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import { LOGIN_FAIL_ERROR_ALARM_PHARE_TEXT } from 'const/SystemPhraseConst';
import { NAVER_LOGIN_TITLE_NAME } from 'const/TabConfigConst';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postNaverLogin } from 'services/auth/naver/postNaverLogin';
import styled from 'styled-components';

const naver = window.naver;
const NaverLoginButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const naverLogin = () => {
    const naverInstance = new naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID,
      callbackUrl: NAVER_CALLBACK_URL,
      isPopup: false,
      loginButton: {
        color: 'green',
        type: 0,
        height: 50,
      },
    });
    naverInstance.init();
  };

  useEffect(() => {
    naverLogin();
  }, []);

  const handleNaverClick = () => {
    const naverLoginButton = document.getElementById(
      'naverIdLogin_loginButton',
    );
    if (naverLoginButton) naverLoginButton.click();
  };

  const params = new URLSearchParams(location.hash.substring(1));
  const accessToken = params.get('access_token');

  if (accessToken) {
    postNaverLogin(accessToken)
      .then(() => {
        const callbackUrl = sessionStorage.getItem(CALLBACK_URL);
        if (callbackUrl !== null) {
          navigate(callbackUrl);
        } else {
          navigate(HOME_PATH);
        }
      })
      .catch((err: AxiosError) => {
        // 인증 오류 날 시, 회원가입 페이지로 이동
        if (err.response?.status === STATUS_UNAUTHORIZED_CODE) {
          console.log('주소로 이동 해랗');
          navigate(SIGNUP_PATH);
        } else {
          // 나머지 오류는 회원가입 실패 알림 과 홈으로 이동
          alert(LOGIN_FAIL_ERROR_ALARM_PHARE_TEXT);
          console.error(err);
          navigate(HOME_PATH);
        }
      });
  }
  return (
    <LoginElementWrap onClick={handleNaverClick}>
      <LoginElementLogoWrap>
        <NaverLoginIcon />
      </LoginElementLogoWrap>
      <LoginElementTitle>{NAVER_LOGIN_TITLE_NAME}</LoginElementTitle>
      <div id="naverIdLogin" style={{ display: 'none' }} />
    </LoginElementWrap>
  );
};

const LoginElementWrap = styled.div`
  display: flex;
  padding: 14px 0;
  border-radius: 16px;
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  position: relative;
  cursor: pointer;
  color: ${({ theme }) => theme.mainColor.White};
  background-color: ${({ theme }) => theme.snsColor.Naver};
`;

const LoginElementLogoWrap = styled.div`
  display: flex;
  padding-left: 12px;
`;

const LoginElementTitle = styled.div`
  position: absolute;
  position: absolute;
  left: 50%;
  top: 13%;
  transform: translate(-50%, 50%);
  font: ${({ theme }) => theme.fontSizes.Subhead2};
`;

export default NaverLoginButton;
