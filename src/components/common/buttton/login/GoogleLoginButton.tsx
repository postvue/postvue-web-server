import {
  CredentialResponse,
  TokenResponse,
  useGoogleLogin,
} from '@react-oauth/google';
import { queryClient } from 'App';
import { ReactComponent as GoogleLoginButtonIcon } from 'assets/images/icon/svg/login/GoogleLoginIcon.svg';
import { STATUS_UNAUTHORIZED_CODE } from 'const/HttpStatusConst';
import { GOOGLE_OAUTH_CLIENT_ID } from 'const/login/GoogleConst';
import { HOME_PATH, SIGNUP_PATH } from 'const/PathConst';
import { QUERY_STATE_NOTIFICATION_MSG } from 'const/QueryClientConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import { GOOGLE_LOGIN_TITLE_NAME } from 'const/TabConfigConst';
import {
  isApp,
  stackRouterLoginSuccess,
} from 'global/util/reactnative/nativeRouter';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { postGoogleLogin } from 'services/auth/google/postGoogleLogin';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import theme from 'styles/theme';

const GoogleLoginButton: React.FC = () => {
  const clientId = GOOGLE_OAUTH_CLIENT_ID;

  const navigate = useNavigate();

  const googleLoginOnSuccess = (res: CredentialResponse) => {
    if (!res.credential) return;

    // 백엔드로 `idToken` 전송
    postGoogleLogin(res.credential)
      .then((value) => {
        const callbackUrl = sessionStorage.getItem(CALLBACK_URL);
        const url = callbackUrl ? callbackUrl : HOME_PATH;
        queryClient.invalidateQueries({
          queryKey: [QUERY_STATE_NOTIFICATION_MSG],
        });
        if (isApp()) {
          stackRouterLoginSuccess(value);
        } else {
          navigate(url);
        }
      })
      .catch((err) => {
        // 인증 오류 날 시, 회원가입 페이지로 이동
        if (err.response?.status === STATUS_UNAUTHORIZED_CODE) {
          // navigate(SIGNUP_PATH);
          window.location.href = SIGNUP_PATH;
        } else {
          // 나머지 오류는 회원가입 실패 알림 과 홈으로 이동
          // alert(LOGIN_FAIL_ERROR_ALARM_PHARE_TEXT);
          const data: any = err.response?.data;
          alert(data.message);
          console.error(err);
        }
      });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        const value = await postGoogleLogin(tokenResponse.access_token);
        const callbackUrl = sessionStorage.getItem(CALLBACK_URL) || HOME_PATH;

        queryClient.invalidateQueries({
          queryKey: [QUERY_STATE_NOTIFICATION_MSG],
        });

        if (isApp()) {
          stackRouterLoginSuccess(value);
        } else {
          navigate(callbackUrl);
        }
      } catch (err: any) {
        console.error('Google 로그인 오류:', err);

        if (err.response?.status === STATUS_UNAUTHORIZED_CODE) {
          window.location.href = SIGNUP_PATH;
        } else {
          alert(
            err.response?.data?.message || '로그인 중 오류가 발생했습니다.',
          );
        }
      }
    },
    onError: () => {
      alert('Google 로그인에 실패했습니다.');
    },
  });

  return (
    // <LoginElementWrap>
    //   <LoginElementLogoWrap>
    //     <GoogleLoginIcon />
    //   </LoginElementLogoWrap>
    //   <LoginElementTitle>{GOOGLE_LOGIN_TITLE_NAME}</LoginElementTitle>
    // </LoginElementWrap>
    <>
      {/* <GoogleOneTap clientId={clientId} onLoginSuccess={googleLoginOnSuccess} /> */}

      {/* <LoginElementWrap>
          <GoogleLogin
            shape="circle"
            theme={undefined}
            onSuccess={googleLoginOnSuccess}
            onError={() => {
              alert('오류로 인해 로그인에 실패했습니다.');
            }}
            size="large"
            width={'500px'}
          />
        </LoginElementWrap> */}
      <LoginElementWrap onClick={() => googleLogin()}>
        <LoginElementLogoWrap>
          <GoogleLoginButtonIcon />
        </LoginElementLogoWrap>
        <LoginElementTitle>{GOOGLE_LOGIN_TITLE_NAME}</LoginElementTitle>
      </LoginElementWrap>
    </>
  );
};

const GoogleLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const ButtonText = styled.span`
  font-weight: bold;
  color: #1f1f1f;
`;

const LoginElementWrap = styled.div`
  height: 48px;
  border: 1px solid ${theme.grey.Grey2};
  border-radius: 16px;
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  position: relative;
  cursor: pointer;
  color: ${({ theme }) => theme.mainColor.Black};
  background-color: ${({ theme }) => theme.snsColor.Google};
  cursor: pointer;

  display: flex;
  justify-content: center;
  transition: filter 0.2s ease-in-out;
  ${filterBrigntnessStyle}
`;

const LoginElementLogoWrap = styled.div`
  padding-right: 6px;
  display: flex;
  margin: auto 0;
`;

const LoginElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: #1f1f1f;
  margin: auto 0px;
`;

export default GoogleLoginButton;
