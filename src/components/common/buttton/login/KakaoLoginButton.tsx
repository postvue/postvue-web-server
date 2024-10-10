import { ReactComponent as KakaoLoginIcon } from 'assets/images/icon/svg/login/KakaoLoginIcon.svg';
import { AxiosError } from 'axios';
import { STATUS_UNAUTHORIZED_CODE } from 'const/HttpStatusConst';
import {
  KAKAO_LOGIN_CODE_QUERY_PARAM,
  KAKAO_REDIRECT_URI,
} from 'const/login/KakaoConst';
import { HOME_PATH, SIGNUP_PATH } from 'const/PathConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import { LOGIN_FAIL_ERROR_ALARM_PHARE_TEXT } from 'const/SystemPhraseConst';
import { KAKAO_LOGIN_TITLE_NAME } from 'const/TabConfigConst';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { postKakaoAuthToken } from 'services/auth/kakao/postKakaoAuthToken';
import { postKakaoLogin } from 'services/auth/kakao/postKakaoLogin';
import styled from 'styled-components';

const KakaoLoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    Kakao.Auth.authorize({
      redirectUri: KAKAO_REDIRECT_URI,
    });
  };

  const code = new URL(window.location.href).searchParams.get(
    KAKAO_LOGIN_CODE_QUERY_PARAM,
  );

  if (code !== null) {
    postKakaoAuthToken(code)
      .then((res) => {
        postKakaoLogin(res.access_token)
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
              navigate(SIGNUP_PATH);
            } else {
              // 나머지 오류는 회원가입 실패 알림 과 홈으로 이동
              alert(LOGIN_FAIL_ERROR_ALARM_PHARE_TEXT);
              console.error(err);
              // navigate(HOME_PATH);
            }
          });
      })
      .catch(() => {
        //@REFER: 왜 이렇게 지었지?, 확인 바람
        navigate(-2);
      });
  }

  return (
    <LoginElementWrap onClick={handleLogin}>
      <LoginElementLogoWrap>
        <KakaoLoginIcon />
      </LoginElementLogoWrap>
      <LoginElementTitle>{KAKAO_LOGIN_TITLE_NAME}</LoginElementTitle>
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
  color: ${({ theme }) => theme.mainColor.Black};
  background-color: ${({ theme }) => theme.snsColor.Kakao};
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

export default KakaoLoginButton;
