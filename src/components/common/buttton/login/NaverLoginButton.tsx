import { queryClient } from 'App';
import { ReactComponent as NaverLoginIcon } from 'assets/images/icon/svg/login/NaverLoginIcon.svg';
import { AxiosError } from 'axios';
import LoadingComponent from 'components/common/container/LoadingComponent';
import { STATUS_UNAUTHORIZED_CODE } from 'const/HttpStatusConst';
import { NAVER_CALLBACK_URL, NAVER_CLIENT_ID } from 'const/login/NaverConst';
import { HOME_PATH, SIGNUP_PATH } from 'const/PathConst';
import { QUERY_STATE_NOTIFICATION_MSG } from 'const/QueryClientConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import {
  BRIDGE_EVENT_LOGIN_ROUTE_TYPE,
  BridgeMsgInterface,
  EVENT_DATA_NAVER_LOGIN_TYPE,
  EventDateInterface,
} from 'const/ReactNativeConst';
import { NAVER_LOGIN_TITLE_NAME } from 'const/TabConfigConst';
import {
  isApp,
  stackRouterLoginSuccess,
} from 'global/util/reactnative/nativeRouter';
import { useMessageListener } from 'hook/customhook/useMessageListener';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import { postNaverLogin } from 'services/auth/naver/postNaverLogin';
import { serviceUsageTimerStateAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';

const naverLoginSrc =
  'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';

const NaverLoginButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const resetServiceUsageTimerState = useResetRecoilState(
    serviceUsageTimerStateAtom,
  );

  const handleMessage = (event: MessageEvent) => {
    if (!isApp()) return;
    try {
      const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

      if (nativeEvent.type === BRIDGE_EVENT_LOGIN_ROUTE_TYPE) {
        const eventData: EventDateInterface = nativeEvent.data;

        if (eventData.eventType === EVENT_DATA_NAVER_LOGIN_TYPE) {
          processNaverLogin(eventData.data);
        }
      }
    } catch (error) {
      console.error('Failed to parse message:', event.data);
    }
  };

  useMessageListener(handleMessage);

  useEffect(() => {
    let script = document.querySelector(
      `script[src="${naverLoginSrc}"]`,
    ) as HTMLScriptElement | null;

    //script가 없을시 실행하여 중복돼서 생기지 않도록 함
    if (!script) {
      script = document.createElement('script'); //script태그를 추가해준다.
      script.src = naverLoginSrc;
      script.type = 'text/javascript';
      script.charset = 'utf-8';
      script.async = true;
    }

    script.onload = () => {
      if (window.naver) {
        try {
          console.log('네이버 SDK 로드 성공');
          const naverInstance = new window.naver.LoginWithNaverId({
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
        } catch (e) {
          alert(e);
        }
      } else {
        console.error('네이버 SDK가 로드되지 않았습니다.');
      }
    };

    script.onerror = () => {
      console.error('네이버 SDK 로드 실패');
    };

    document.body.appendChild(script);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script); // 부모 노드에서 제거
      }
    };
  }, []);

  const handleNaverClick = () => {
    const naverLoginButton = document.getElementById(
      'naverIdLogin_loginButton',
    );

    if (naverLoginButton) naverLoginButton.click();
  };

  const params = new URLSearchParams(location.hash.substring(1));
  const accessToken = params.get('access_token');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processNaverLogin = (accessToken: string) => {
    setIsLoading(true);
    postNaverLogin(accessToken)
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
          // navigate(SIGNUP_PATH);
          window.location.href = SIGNUP_PATH;
        } else {
          // 나머지 오류는 회원가입 실패 알림 과 홈으로 이동
          // alert(LOGIN_FAIL_ERROR_ALARM_PHARE_TEXT);
          alert(err);
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!accessToken) return;
    processNaverLogin(accessToken);
  }, [accessToken]);

  return (
    <>
      <LoginElementWrap onClick={handleNaverClick}>
        <LoginElementLogoWrap>
          <NaverLoginIcon />
        </LoginElementLogoWrap>
        <LoginElementTitle>{NAVER_LOGIN_TITLE_NAME}</LoginElementTitle>
        <div id="naverIdLogin" style={{ display: 'none' }} />
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
  color: ${({ theme }) => theme.mainColor.White};
  background-color: ${({ theme }) => theme.snsColor.Naver};
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

export default NaverLoginButton;
