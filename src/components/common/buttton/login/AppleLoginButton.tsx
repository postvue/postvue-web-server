import { queryClient } from 'App';
import { AxiosError } from 'axios';
import LoadingComponent from 'components/common/container/LoadingComponent';
import { STATUS_UNAUTHORIZED_CODE } from 'const/HttpStatusConst';
import { HOME_PATH, SIGNUP_PATH } from 'const/PathConst';
import { QUERY_STATE_NOTIFICATION_MSG } from 'const/QueryClientConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import { APPLE_LOGIN_TITLE_NAME } from 'const/TabConfigConst';
import {
  isApp,
  stackRouterLoginSuccess,
} from 'global/util/reactnative/nativeRouter';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAppleLogin } from 'services/auth/apple/postAppleLogin';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import AppleAuthLoginProvider from './AppleAuthLoginProvider';

const AppleLoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleAppleLogin = async () => {
    try {
      const response = await window.AppleID.auth.signIn();
      console.log('Apple 로그인 성공:', response.authorization);
      processAppleLogin(response.authorization.id_token);

      // response.authorization.id_token을 백엔드로 전송하여 검증
    } catch (error) {
      console.error('Apple 로그인 실패:', error);
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processAppleLogin = (idToken: string) => {
    setIsLoading(true);
    postAppleLogin(idToken)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_STATE_NOTIFICATION_MSG],
        });
        if (isApp()) {
          stackRouterLoginSuccess(res);
        } else {
          const callbackUrl = sessionStorage.getItem(CALLBACK_URL);
          const url = callbackUrl ? callbackUrl : HOME_PATH;
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

  return (
    <>
      <AppleAuthLoginProvider />
      <ButtonWrapper onClick={handleAppleLogin}>
        <LoginElementLogoWrap>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="login-v2-button__item__logo"
          >
            <title>apple 로고</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.4794 2.87222C10.9033 3.60458 9.93577 4.15385 9.16394 4.15385C9.07697 4.15385 8.99 4.1424 8.93565 4.13096C8.92478 4.08519 8.90303 3.94787 8.90303 3.81055C8.90303 2.87222 9.34874 1.95677 9.83793 1.37317C10.4576 0.606485 11.4903 0.0343293 12.3491 0C12.3709 0.102988 12.3817 0.228862 12.3817 0.354736C12.3817 1.28163 12.0013 2.20852 11.4794 2.87222ZM7.69888 17.6589C7.31148 17.834 6.94435 18 6.44622 18C5.38087 18 4.64164 16.9701 3.79371 15.7114C2.80445 14.2238 2 11.9237 2 9.74952C2 6.24793 4.16332 4.39415 6.29403 4.39415C6.91592 4.39415 7.48415 4.63418 7.98942 4.84762C8.39389 5.01847 8.758 5.17228 9.07699 5.17228C9.35367 5.17228 9.69848 5.02885 10.1004 4.86167C10.6617 4.62818 11.3344 4.34837 12.0882 4.34837C12.5666 4.34837 14.3168 4.39415 15.4691 6.1335C15.4625 6.1389 15.4484 6.14869 15.4279 6.16296C15.1444 6.35998 13.6319 7.41097 13.6319 9.56643C13.6319 12.2327 15.8387 13.1824 15.9148 13.2053C15.9129 13.2105 15.9084 13.2251 15.9012 13.2485C15.8287 13.4848 15.4828 14.6115 14.7408 15.7571C14.0124 16.8557 13.2406 17.9771 12.0882 17.9771C11.5203 17.9771 11.1584 17.8084 10.7847 17.6342C10.386 17.4483 9.97383 17.2562 9.28354 17.2562C8.58953 17.2562 8.13156 17.4632 7.69888 17.6589Z"
              fill="white"
            ></path>
          </svg>
        </LoginElementLogoWrap>
        <LoginElementTitle>{APPLE_LOGIN_TITLE_NAME}</LoginElementTitle>
      </ButtonWrapper>
      {isLoading && <LoadingComponent LoadingComponentStyle={{ top: '0px' }} />}
    </>
  );
};

const ButtonWrapper = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  display: flex;
  justify-content: center;
  background-color: black;
  border-radius: 20px;
  height: 50px;
  border-radius: 16px;
  cursor: pointer;

  transition: filter 0.2s ease-in-out;
  ${filterBrigntnessStyle};
`;

const LoginElementLogoWrap = styled.div`
  padding-right: 6px;
  display: flex;
  margin: auto 0;
`;

const LoginElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: white;
  margin: auto 0;
`;

export default AppleLoginButton;
