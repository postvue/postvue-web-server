import { queryClient } from 'App';
import { ReactComponent as KakaoLoginIcon } from 'assets/images/icon/svg/login/KakaoLoginIcon.svg';
import { AxiosError } from 'axios';
import LoadingComponent from 'components/common/container/LoadingComponent';
import KakaoInitConfig from 'config/appconfig/KakaoInitConfig';
import { STATUS_UNAUTHORIZED_CODE } from 'const/HttpStatusConst';
import {
  KAKAO_LOGIN_CODE_QUERY_PARAM,
  KAKAO_REDIRECT_URI,
} from 'const/login/KakaoConst';
import { HOME_PATH, SIGNUP_PATH } from 'const/PathConst';
import { QUERY_STATE_NOTIFICATION_MSG } from 'const/QueryClientConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import {
  BRIDGE_EVENT_LOGIN_ROUTE_TYPE,
  BridgeMsgInterface,
  EVENT_DATA_KAKAO_LOGIN_TYPE,
  EventDateInterface,
} from 'const/ReactNativeConst';
import { LOGIN_FAIL_ERROR_ALARM_PHARE_TEXT } from 'const/SystemPhraseConst';
import { KAKAO_LOGIN_TITLE_NAME } from 'const/TabConfigConst';
import {
  isApp,
  sendKakaoLoginRequestEvnet,
  stackRouterLoginSuccess,
} from 'global/util/reactnative/nativeRouter';
import { useMessageListener } from 'hook/customhook/useMessageListener';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import { postKakaoAuthToken } from 'services/auth/kakao/postKakaoAuthToken';
import { postKakaoLogin } from 'services/auth/kakao/postKakaoLogin';
import { serviceUsageTimerStateAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';

const KakaoLoginButton: React.FC = () => {
  const navigate = useNavigate();

  const resetServiceUsageTimerState = useResetRecoilState(
    serviceUsageTimerStateAtom,
  );

  const handleLogin = () => {
    if (isApp()) {
      sendKakaoLoginRequestEvnet();
    } else {
      if (!window.Kakao) return;

      window.Kakao.Auth.authorize({
        redirectUri: KAKAO_REDIRECT_URI,
      });
    }
  };

  // const handleLogin = () => {
  //   // const link = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_SDK_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  //   // window.location.href = link;
  //   window.Kakao.Auth.login({
  //     success: async function (data: any) {
  //     },
  //     fail: function (data: any) {
  //       alert(data);
  //     },
  //   });
  //   // window.Kakao.Auth.authorize({
  //   //   redirectUri: KAKAO_REDIRECT_URI,
  //   // });
  // };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const kakaoLoginProcess = (access_token: string) => {
    setIsLoading(true);
    postKakaoLogin(access_token)
      .then((res) => {
        const callbackUrl = sessionStorage.getItem(CALLBACK_URL);
        const url = callbackUrl ? callbackUrl : HOME_PATH;
        queryClient.invalidateQueries({
          queryKey: [QUERY_STATE_NOTIFICATION_MSG],
        });

        resetServiceUsageTimerState();
        if (isApp()) {
          stackRouterLoginSuccess(res);
        } else {
          navigate(url);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // const code = new URL(window.location.href).searchParams.get(
  //   KAKAO_LOGIN_CODE_QUERY_PARAM,
  // );

  // if (code !== null) {
  //   if (!isApp()) {
  //     postKakaoAuthToken(code)
  //       .then((res) => {
  //         kakaoLoginProcess(res.access_token);
  //       })
  //       .catch((e) => {
  //         navigate(-2);
  //       });
  //   }
  // }

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get(
      KAKAO_LOGIN_CODE_QUERY_PARAM,
    );

    if (code && !isApp()) {
      setIsLoading(true);
      postKakaoAuthToken(code)
        .then((res) => {
          kakaoLoginProcess(res.access_token);
        })
        .catch((e) => {
          alert('카카오 로그인 인증에 실패했습니다. 다시 시도해주세요.');
          console.error(e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const handleMessage = (event: MessageEvent) => {
    if (!isApp()) return;
    try {
      const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

      if (nativeEvent.type === BRIDGE_EVENT_LOGIN_ROUTE_TYPE) {
        const eventData: EventDateInterface = nativeEvent.data;

        if (eventData.eventType === EVENT_DATA_KAKAO_LOGIN_TYPE) {
          kakaoLoginProcess(eventData.authToken.accessToken);
        }
      }
    } catch (error) {
      console.error('Failed to parse message:', event.data);
    }
  };

  useMessageListener(handleMessage);

  return (
    <>
      <KakaoInitConfig />
      <LoginElementWrap onClick={handleLogin}>
        <LoginElementLogoWrap>
          <KakaoLoginIcon />
        </LoginElementLogoWrap>
        <LoginElementTitle>{KAKAO_LOGIN_TITLE_NAME}</LoginElementTitle>
      </LoginElementWrap>
      {isLoading && <LoadingComponent LoadingComponentStyle={{ top: '0px' }} />}
    </>
  );
};

const LoginElementWrap = styled.div`
  display: flex;
  height: 50px;
  border-radius: 16px;
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  position: relative;
  cursor: pointer;
  color: ${({ theme }) => theme.mainColor.Black};
  background-color: ${({ theme }) => theme.snsColor.Kakao};

  display: flex;
  justify-content: center;

  transition: filter 0.2s ease-in-out;
  ${filterBrigntnessStyle};
`;

const LoginElementLogoWrap = styled.div`
  display: flex;
  margin: auto 0;
  padding-right: 6px;
`;

const LoginElementTitle = styled.div`
  margin: auto 0;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

export default KakaoLoginButton;
