import { ReactComponent as FeelogMobileLogo } from 'assets/images/icon/svg/logo/FeelogVeryLargeLogo.svg';
import { HOME_PATH } from 'const/PathConst';
import {
  CALLBACK_URL,
  IS_WITHDRAW_QUERY_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import React, { useEffect, useState } from 'react';
import { postRefreshToken } from 'services/auth/postRefreshToken';
import styled from 'styled-components';

import { queryClient } from 'App';
import { ReactComponent as LoginCancelButtonIcon } from 'assets/images/icon/svg/login/LoginCancelButtonIcon.svg';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import AppleLoginButton from 'components/common/buttton/login/AppleLoginButton';
import GoogleLoginButton from 'components/common/buttton/login/GoogleLoginButton';
import KakaoLoginButton from 'components/common/buttton/login/KakaoLoginButton';
import NaverLoginButton from 'components/common/buttton/login/NaverLoginButton';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import LoginEmailPopup from 'components/popups/signup/LoginEmailPopup';
import SignupEmailPopup from 'components/popups/signup/SignupEmailPopup';
import SignupSendedEmailPopup from 'components/popups/signup/SignupSendedEmailPopup';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { QUERY_STATE_NOTIFICATION_MSG } from 'const/QueryClientConst';
import { MAX_DELETED_USER_RETENTION_DAY } from 'const/SignupConst';
import { SETTING_AFTER_DELETE_ACCOUNT_MAIN_MOVE_PHASE_TEXT } from 'const/SystemPhraseConst';
import { isApp } from 'global/util/reactnative/nativeRouter';
import useWindowSize from 'hook/customhook/useWindowSize';
import { useSnsNotificationHookByIndexedDb } from 'hook/db/useSnsNotifcationHookByIndexedDb';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { initPageInfoAtom } from 'states/SystemConfigAtom';
import { hoverComponentStyle } from 'styles/commonStyles';
import theme from 'styles/theme';

const LoginPage: React.FC = () => {
  const callbackUrl = new URL(window.location.href).searchParams.get(
    CALLBACK_URL,
  );

  const { resetNotifications } = useSnsNotificationHookByIndexedDb();

  const [isView, setIsView] = useState<boolean>(false);

  if (callbackUrl !== null) {
    sessionStorage.setItem(CALLBACK_URL, callbackUrl);
  }

  const [isWithdraw, setIsWithdraw] = useState<boolean | null>(null);
  const [initPageInfo, setInitPageInfo] = useRecoilState(initPageInfoAtom);
  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        setInitPageInfo((prev) => ({ ...prev, isLoginPage: true }));
      }, 100);
    });
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.has(IS_WITHDRAW_QUERY_PARAM)) {
      setIsWithdraw(
        searchParams.get(IS_WITHDRAW_QUERY_PARAM)
          ? searchParams.get(IS_WITHDRAW_QUERY_PARAM) === TRUE_PARAM
            ? true
            : false
          : null,
      );
    }

    postRefreshToken()
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_STATE_NOTIFICATION_MSG],
        });
        const url = callbackUrl ? callbackUrl : HOME_PATH;

        if (!isApp()) {
          window.location.href = url;
        }
      })
      .catch(() => {
        resetNotifications();
        setIsView(true);
      });

    return () => {
      setIsActiveSignupEmailPopup(false);
    };
  }, []);

  const navigate = useNavigate();
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

  const { windowHeight } = useWindowSize();

  return (
    <>
      <PageHelmentInfoElement
        title={`로그인`}
        ogTitle={`로그인`}
        ogUrl={window.location.href}
        ogDescription={`로그인`}
      />
      {isWithdraw ? (
        <>
          <ProfileAccountDeleteContainer>
            <AccountDeleteCheckTitleWrap>
              {/* <AccountDeleteCheckTitle>
                ㅠㅠ 너무 아쉬워요..
              </AccountDeleteCheckTitle> */}
              <LoginPageLogoWrap
                $height={Math.floor(windowHeight / 2)}
                style={{
                  paddingTop: 'env(safe-area-inset-top)',
                  position: 'fixed',
                  left: '50%',
                  top: '40%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <LoginPageLogoIconWrap>
                  <LoginPageLogoIconSubWrap>
                    <FeelogMobileLogo />
                  </LoginPageLogoIconSubWrap>
                </LoginPageLogoIconWrap>
                <LoginPageLogoTitleWrap>
                  <LoginPageLogoTitle>
                    {/* {LOGIN_TITLE_PHASE_TEXT} */}
                    Feelog
                  </LoginPageLogoTitle>
                </LoginPageLogoTitleWrap>
                <AccountDeleteCheckSubTitle>
                  회원님의 계정은 {MAX_DELETED_USER_RETENTION_DAY}일 후에
                  삭제되며 삭제 시 회원님의 {APP_SERVICE_NAME} 계정 데이터가
                  삭제됩니다. {MAX_DELETED_USER_RETENTION_DAY}일이 지나면 해당
                  계정으로는 다시 가입할 수 없습니다. 복구를 원하시면 회원
                  계정으로 다시 로그인해주세요.
                </AccountDeleteCheckSubTitle>
              </LoginPageLogoWrap>
            </AccountDeleteCheckTitleWrap>

            <BottomNextButton
              title={SETTING_AFTER_DELETE_ACCOUNT_MAIN_MOVE_PHASE_TEXT}
              actionFunc={() => {
                setIsWithdraw(null);
              }}
            />
          </ProfileAccountDeleteContainer>
        </>
      ) : (
        <>
          {isView && (
            <>
              <LoginPageContainer
                style={{
                  opacity: initPageInfo.isLoginPage ? 1 : 0,
                  transition: `opacity 0.3s ease-in`,
                }}
              >
                {!isApp() && (
                  <LoginCancelButtonIconWrap onClick={clickDeleteBtn}>
                    <LoginCancelButtonIcon />
                  </LoginCancelButtonIconWrap>
                )}

                <LoginPageBodyContainer>
                  <LoginPageLogoWrap $height={Math.floor(windowHeight / 2)}>
                    <LoginPageLogoIconWrap>
                      <LoginPageLogoIconSubWrap>
                        <FeelogMobileLogo />
                      </LoginPageLogoIconSubWrap>
                    </LoginPageLogoIconWrap>
                    <LoginPageLogoTitleWrap>
                      <LoginPageLogoTitle>
                        {/* {LOGIN_TITLE_PHASE_TEXT} */}
                        Feelog
                      </LoginPageLogoTitle>
                    </LoginPageLogoTitleWrap>
                  </LoginPageLogoWrap>
                  <KakaoLoginButton />
                  <NaverLoginButton />

                  <GoogleLoginButton />

                  <AppleLoginButton />

                  <EmailLoginButtonWrap onClick={onClickLoginEmail}>
                    이메일로 로그인
                  </EmailLoginButtonWrap>
                </LoginPageBodyContainer>
              </LoginPageContainer>
              {isActiveLoginEmailPopup && (
                <LoginEmailPopup
                  isOpen={isActiveLoginEmailPopup}
                  onClose={() => setIsActiveLoginEmailPopup(false)}
                  onOpen={() => {
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

const LoginPageLogoWrap = styled.div<{ $height: number }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-bottom: min(
    calc(100dvh - 600px),
    max(${(props) => props.$height - 350}px, 0px)
  );
  width: 100%;
`;

const LoginPageLogoIconWrap = styled.div`
  display: flex;
`;

const LoginPageLogoIconSubWrap = styled.div`
  margin: 0 auto;
`;

const LoginPageLogoTitleWrap = styled.div``;

const LoginPageLogoTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  font-size: 18px;
  text-align: center;
`;

const LoginPageBodyContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 10px;

  position: fixed;
  width: 100%;
  bottom: 0px;
  padding: 30px 0px 20px 0px;
  left: 50%;
  transform: translate(-50%, 0px);
  margin-bottom: env(safe-area-inset-bottom);

  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
`;

const EmailLoginButtonWrap = styled.div`
  text-align: center;
  padding: 14px 0;
  border-radius: 16px;
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey4};
  cursor: pointer;

  transition: background 0.2s ease-in-out;
  ${hoverComponentStyle};
`;

const LoginCancelButtonIconWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  cursor: pointer;

  margin: 20px 0 0 20px;
`;

const ProfileAccountDeleteContainer = styled.div`
  left: 50%;
  transform: translate(-50%, 0px);
  max-width: ${theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  height: 100dvh;
  position: fixed;
`;

const AccountDeleteCheckTitleWrap = styled.div``;

const AccountDeleteCheckSubTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  text-align: center;
  padding: 0 ${theme.systemSize.appDisplaySize.bothSidePadding};
  margin-top: 20px;
`;

export default LoginPage;
