import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { HOME_PATH } from 'const/PathConst';
import {
  SETTING_AFTER_DELETE_ACCOUNT_MAIN_MOVE_PHASE_TEXT,
  SETTING_DELETE_ACCOUNT_PHASE_TEXT,
} from 'const/SystemPhraseConst';
import { resetAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { useNavigate } from 'react-router-dom';
import { deleteAuthDeleteAccount } from 'services/auth/deleteAuthDeleteAccount';

const ProfileAccountDeleteAccountBody: React.FC = () => {
  const navigate = useNavigate();
  const bottomNextButtonRef = useRef<HTMLDivElement>(null);
  const [isDeleteAccount, setIsDeleteAccount] = useState<boolean>(false);

  const [bottomHeight, setBottomHeight] = useState<number>(0);

  const onClickDeleteAccount = () => {
    deleteAuthDeleteAccount().then(() => {
      setIsDeleteAccount(true);
      resetAccessTokenToLocalStorage();
    });
  };

  useEffect(() => {
    setBottomHeight(bottomNextButtonRef.current?.offsetHeight || 0);
  }, [bottomNextButtonRef.current]);
  return (
    <ProfileAccountDeleteContainer>
      {isDeleteAccount ? (
        <>
          <AccountDeleteCheckTitleWrap>
            <AccountDeleteCheckTitle>
              ㅠㅠ 너무 아쉬워요..
            </AccountDeleteCheckTitle>
            <AccountDeleteCheckSubTitle>
              회원님의 계정은 7일 후에 삭제되며 삭제 시 회원님의 $
              {APP_SERVICE_NAME} 계정 데이터가 삭제됩니다. 7일 이전에 삭제를
              취소하려면 회원의 계정으로 다시 로그인해주세요.
            </AccountDeleteCheckSubTitle>
          </AccountDeleteCheckTitleWrap>

          <BottomNextButton
            title={SETTING_AFTER_DELETE_ACCOUNT_MAIN_MOVE_PHASE_TEXT}
            actionFunc={() => {
              navigate(HOME_PATH);
            }}
          />
        </>
      ) : (
        <>
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
            actionFunc={onClickDeleteAccount}
          />
        </>
      )}
    </ProfileAccountDeleteContainer>
  );
};

const ProfileAccountDeleteContainer = styled.div`
  padding-top: 30px;
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
`;

const AccountDeleteCheckFocusWrap = styled.div<{ $bottom: number }>`
  position: fixed;
  bottom: ${(props) => props.$bottom}px;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  color: ${({ theme }) => theme.grey.Grey6};
  font: ${({ theme }) => theme.fontSizes.Body2};
  text-align: center;
`;

const AccountDeleteCheckFocus = styled.div``;

export default ProfileAccountDeleteAccountBody;
