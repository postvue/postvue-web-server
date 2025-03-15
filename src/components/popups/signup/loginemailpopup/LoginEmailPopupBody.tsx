import { queryClient } from 'App';
import { ReactComponent as FeelogLogo } from 'assets/images/icon/svg/logo/FeelogLargeLogo.svg';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import PasswordVisibleInputElement from 'components/profile/profileaccountsetting/profileaccountsettingmanage/password/PasswordVisibleInputElement';
import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { HOME_PATH } from 'const/PathConst';
import { QUERY_STATE_NOTIFICATION_MSG } from 'const/QueryClientConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import { LOING_PASSWORD_PHASE_TEXT } from 'const/SystemPhraseConst';
import {
  isApp,
  stackRouterLoginSuccess,
} from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import { postEmailLogin } from 'services/auth/email/postEmailLogin';
import { serviceUsageTimerStateAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';

interface LoginEmailPopupBodyProps {
  onOpen: () => void;
  height: number;
}

const LoginEmailPopupBody: React.FC<LoginEmailPopupBodyProps> = ({
  onOpen,
  height,
}) => {
  const [email, setEmail] = useState<string>(INIT_EMPTY_STRING_VALUE);

  const [password, setPassword] = useState<string>(INIT_EMPTY_STRING_VALUE);

  const resetServiceUsageTimerState = useResetRecoilState(
    serviceUsageTimerStateAtom,
  );

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVerifedEmail) {
      setIsVerifedEmail(true);
    }

    setPassword(e.target.value);
  };

  const navigate = useNavigate();

  const [isVerifedEmail, setIsVerifedEmail] = useState<boolean>(true);

  const onClicLoginEmail = () => {
    postEmailLogin(email, password)
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
      .catch(() => {
        setIsVerifedEmail(false);
      });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === 'Enter' &&
      event.nativeEvent.isComposing === false &&
      isValidString(password) &&
      isValidString(email)
    ) {
      onClicLoginEmail();
    }
  };
  return (
    <>
      <LoginLogoWrap>
        <LoginLogoSubWrap>
          <FeelogLogo />
        </LoginLogoSubWrap>
      </LoginLogoWrap>
      <LoginEmailSubTitle>Feelog</LoginEmailSubTitle>

      <LoginEmailInputWrap>
        <LoginEmailInputSubWrap>
          <LoginEmailInput
            type={'email'}
            value={email}
            placeholder="이메일"
            onChange={onChangeEmail}
            onKeyDown={handleKeyPress}
          />
        </LoginEmailInputSubWrap>
        <ProfilePasswordInputWrap>
          <PasswordVisibleInputElement
            password={password}
            onChangePassword={onChangePassword}
            placeholder={LOING_PASSWORD_PHASE_TEXT}
            onKeyDown={handleKeyPress}
          />

          {!isVerifedEmail && (
            <LoginMinAgeWrap>
              <LoginMinAgeCheck>비밀번호가 틀립니다.</LoginMinAgeCheck>
            </LoginMinAgeWrap>
          )}
        </ProfilePasswordInputWrap>
      </LoginEmailInputWrap>

      <LoginWrap $height={height}>
        {!isApp() && (
          <LoginButton onClick={onOpen}>이메일로 가입하기</LoginButton>
        )}
        <BottomNextButton
          title="로그인"
          notActiveTitle="로그인"
          isTransparent={true}
          isActive={isValidString(password) && isValidString(email)}
          actionFunc={onClicLoginEmail}
          BottomNextButtonWrapContainerStyle={{ position: 'static' }}
        />
      </LoginWrap>
    </>
  );
};

const LoginWrap = styled.div<{ $height: number }>`
  width: 100%;
  margin-top: ${(props) => props.$height - 370}px;
`;

const LoginButton = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey5};
  margin-bottom: 10px;
  padding: 2px 4px;
  cursor: pointer;
`;
const LoginEmailSubTitle = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  margin-bottom: 20px;
`;

const LoginLogoWrap = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const LoginLogoSubWrap = styled.div`
  display: flex;
  margin: 0 auto;
`;

const LoginEmailInputWrap = styled.div`
  margin: 0 20px;
  gap: 20px;
  display: flex;
  flex-flow: column;
`;

const LoginEmailInputSubWrap = styled.div`
  display: flex;
  flex-flow: column;
`;

const LoginEmailInput = styled.input`
  outline: none;
  border: 0px;

  padding: 15px 16px;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  box-sizing: border-box;
  outline: none;
  border-radius: 30px;
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const ProfilePasswordInputWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 5px;
  position: relative;
`;

// const ProfilePasswordInput = styled.input`
//   padding: 15px 16px;
//   background-color: white;
//   border: 1px solid ${({ theme }) => theme.grey.Grey1};

//   width: 100%;
//   box-sizing: border-box;
//   outline: none;
//   border-radius: 30px;
//   font: ${({ theme }) => theme.fontSizes.Body2};
// `;

const LoginMinAgeWrap = styled.div`
  margin: 7px 0px 0px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  position: absolute;
  bottom: -27px;
`;

const LoginMinAgeCheck = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.errorColor.Red};
`;

export default LoginEmailPopupBody;
