import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { queryClient } from 'App';
import { ReactComponent as GoogleLoginButtonIcon } from 'assets/images/icon/svg/login/GoogleLoginIcon.svg';
import LoadingComponent from 'components/common/container/LoadingComponent';
import { STATUS_UNAUTHORIZED_CODE } from 'const/HttpStatusConst';
import { GOOGLE_OAUTH_CLIENT_ID } from 'const/login/GoogleConst';
import { HOME_PATH, SIGNUP_PATH } from 'const/PathConst';
import { QUERY_STATE_NOTIFICATION_MSG } from 'const/QueryClientConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import {
  BRIDGE_EVENT_LOGIN_ROUTE_TYPE,
  BridgeMsgInterface,
  EVENT_DATA_GOOGLE_LOGIN_TYPE,
  EventDateInterface,
} from 'const/ReactNativeConst';
import { GOOGLE_LOGIN_TITLE_NAME } from 'const/TabConfigConst';
import {
  isApp,
  sendGoogleLoginRequestEvnet,
  stackRouterLoginSuccess,
} from 'global/util/reactnative/nativeRouter';
import { useMessageListener } from 'hook/customhook/useMessageListener';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import { postGoogleLogin } from 'services/auth/google/postGoogleLogin';
import { serviceUsageTimerStateAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import theme from 'styles/theme';

const GoogleLoginButton: React.FC = () => {
  const clientId = GOOGLE_OAUTH_CLIENT_ID;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const googleLoginOnSuccess = (accessToken: string) => {
    if (!accessToken) return;

    // 백엔드로 `idToken` 전송
    setIsLoading(true);
    postGoogleLogin(accessToken)
      .then((value) => {
        const callbackUrl = sessionStorage.getItem(CALLBACK_URL);
        const url = callbackUrl ? callbackUrl : HOME_PATH;
        queryClient.invalidateQueries({
          queryKey: [QUERY_STATE_NOTIFICATION_MSG],
        });

        resetServiceUsageTimerState();
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resetServiceUsageTimerState = useResetRecoilState(
    serviceUsageTimerStateAtom,
  );

  const googleLoginProcess = () => {
    if (isApp()) {
      googleLoginByApp();
    } else {
      googleLoginByWeb();
    }
  };

  const googleLoginByApp = () => {
    sendGoogleLoginRequestEvnet();
  };

  // const processAccessTokenToServer = async (accessToken: string) => {
  //   const value = await postGoogleLogin(accessToken);
  //   const callbackUrl = sessionStorage.getItem(CALLBACK_URL) || HOME_PATH;

  //   queryClient.invalidateQueries({
  //     queryKey: [QUERY_STATE_NOTIFICATION_MSG],
  //   });

  //   resetServiceUsageTimerState();
  //   if (isApp()) {
  //     stackRouterLoginSuccess(value);
  //   } else {
  //     navigate(callbackUrl);
  //   }
  // };

  const googleLoginByWeb = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        googleLoginOnSuccess(tokenResponse.access_token);
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

  const handleMessage = (event: MessageEvent) => {
    if (!isApp()) return;
    try {
      const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

      if (nativeEvent.type === BRIDGE_EVENT_LOGIN_ROUTE_TYPE) {
        const eventData: EventDateInterface = nativeEvent.data;

        if (eventData.eventType === EVENT_DATA_GOOGLE_LOGIN_TYPE) {
          googleLoginOnSuccess(eventData.data);
        }
      }
    } catch (error) {
      console.error('Failed to parse message:', event.data);
    }
  };

  useMessageListener(handleMessage);

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
      <LoginElementWrap onClick={() => googleLoginProcess()}>
        <LoginElementLogoWrap>
          <GoogleLoginButtonIcon />
        </LoginElementLogoWrap>
        <LoginElementTitle>{GOOGLE_LOGIN_TITLE_NAME}</LoginElementTitle>
      </LoginElementWrap>
      {isLoading && <LoadingComponent LoadingComponentStyle={{ top: '0px' }} />}
    </>
  );
};

const GoogleLogo = styled.img`
  width: 20px;
  height: 20px;
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
