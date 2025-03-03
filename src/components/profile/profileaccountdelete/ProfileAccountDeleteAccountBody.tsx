import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { queryClient } from 'App';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import AppleAuthLoginProvider from 'components/common/buttton/login/AppleAuthLoginProvider';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { CHANNEL_USER_ID } from 'const/LocalStorageConst';
import { QUERY_STATE_MY_PROFILE_INFO } from 'const/QueryClientConst';
import { SINGUP_APPLE_LOGIN_JOIN_TYPE } from 'const/SignupConst';
import { SETTING_DELETE_ACCOUNT_PHASE_TEXT } from 'const/SystemPhraseConst';
import { resetAccountInfoByLogout } from 'global/util/AuthUtil';
import { resetAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { stackRouterMemberWithdraw } from 'global/util/reactnative/nativeRouter';
import { useActiveUserSessionHookByIndexedDb } from 'hook/db/useActiveUserSessionHookByIndexedDb';
import { useSnsNotificationHookByIndexedDb } from 'hook/db/useSnsNotifcationHookByIndexedDb';
import { useNavigate } from 'react-router-dom';
import { getCheckVerificationCode } from 'services/auth/getCheckVerificationCode';
import { getSignupType } from 'services/auth/getSignupType';
import { postAuthDeleteAccount } from 'services/auth/postAuthDeleteAccount';
import theme from 'styles/theme';

const ProfileAccountDeleteAccountBody: React.FC = () => {
  const navigate = useNavigate();
  const bottomNextButtonRef = useRef<HTMLDivElement>(null);

  const [bottomHeight, setBottomHeight] = useState<number>(0);

  const { resetNotifications } = useSnsNotificationHookByIndexedDb();
  const { resetActiveUserSessions } = useActiveUserSessionHookByIndexedDb();

  const onClickDeleteAccount = async () => {
    let appleAuthorizationCode: string | undefined = undefined;
    if (signupType === SINGUP_APPLE_LOGIN_JOIN_TYPE) {
      const response = await window.AppleID.auth.signIn();

      console.log('Apple 로그인 성공:', response.authorization);
      appleAuthorizationCode = response.authorization.code;
    }
    postAuthDeleteAccount({ appleAuthorizationCode: appleAuthorizationCode })
      .then(() => {
        resetAccessTokenToLocalStorage();
        resetAccountInfoByLogout();
        localStorage.setItem(CHANNEL_USER_ID, '');

        resetNotifications();
        resetActiveUserSessions();
        stackRouterMemberWithdraw(navigate);
      })
      .catch((e) => {
        const data: any = e.response?.data;
        alert(data.message);
      });
  };

  useEffect(() => {
    setBottomHeight(bottomNextButtonRef.current?.offsetHeight || 0);
  }, [bottomNextButtonRef.current]);

  const [signupType, setSignupType] = useState<string | undefined>(undefined);

  useEffect(() => {
    getSignupType()
      .then(async (value) => {
        setSignupType(value);
      })
      .catch((e) => {
        const data: any = e.response?.data;
        alert(data.message);
      });
    return () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_MY_PROFILE_INFO],
      });
    };
  }, []);

  getCheckVerificationCode;
  return (
    <>
      <AppleAuthLoginProvider />
      <ProfileAccountDeleteContainer>
        <AccountDeleteCheckTitleWrap>
          <AccountDeleteCheckTitle>계정 삭제</AccountDeleteCheckTitle>
          <AccountDeleteCheckSubTitle>
            계정 삭제는 영구적이며 회원님이 데이터를 되돌릴 수 없게 됩니다.
            <br />
            {`모든 ${APP_SERVICE_NAME} 계정 데이터와 활동 내용이 삭제 됩니다.`}
          </AccountDeleteCheckSubTitle>
        </AccountDeleteCheckTitleWrap>

        <AccountDeleteCheckFocusWrap $bottom={bottomHeight}>
          <AccountDeleteCheckFocus>
            정말 삭제하시겠습니까?
          </AccountDeleteCheckFocus>
        </AccountDeleteCheckFocusWrap>
        <BottomNextButton
          title={SETTING_DELETE_ACCOUNT_PHASE_TEXT}
          notActiveTitle={SETTING_DELETE_ACCOUNT_PHASE_TEXT}
          bottomNextButtonRef={bottomNextButtonRef}
          isActive={!!signupType}
          actionFunc={() => onClickDeleteAccount()}
        />
      </ProfileAccountDeleteContainer>
    </>
  );
};

const ProfileAccountDeleteContainer = styled.div`
  padding-top: calc(30px + env(safe-area-inset-top));
`;

const AccountDeleteCheckTitleWrap = styled.div``;

const AccountDeleteCheckTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline3};
  text-align: center;
  margin-bottom: 10px;
`;

const AccountDeleteCheckSubTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  text-align: center;
  padding: 0 ${theme.systemSize.appDisplaySize.bothSidePadding};
`;

const AccountDeleteCheckFocusWrap = styled.div<{ $bottom: number }>`
  position: absolute;
  bottom: ${(props) => props.$bottom}px;
  width: 100%;

  color: ${({ theme }) => theme.grey.Grey6};
  font: ${({ theme }) => theme.fontSizes.Body2};
  text-align: center;
`;

const AccountDeleteCheckFocus = styled.div``;

export default ProfileAccountDeleteAccountBody;
