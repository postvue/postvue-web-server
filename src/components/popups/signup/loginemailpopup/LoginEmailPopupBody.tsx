import { ReactComponent as FeelogLogo } from 'assets/images/icon/svg/pc/FeelogLogo.svg';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import PasswordVisibleInputElement from 'components/profile/profileaccountsetting/profileaccountsettingmanage/password/PasswordVisibleInputElement';
import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { HOME_PATH } from 'const/PathConst';
import { CALLBACK_URL } from 'const/QueryParamConst';
import { SETTING_EDIT_PASSWORD_PHASE_TEXT } from 'const/SystemPhraseConst';
import { isApp, stackRouterLogin } from 'global/util/reactnative/StackRouter';
import { isValidString } from 'global/util/ValidUtil';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postEmailLogin } from 'services/auth/email/postEmailLogin';
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
        if (isApp()) {
          stackRouterLogin(value);
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
      <SignupLogoWrap>
        <FeelogLogo />
      </SignupLogoWrap>
      <SignupEmailSubTitle>어떤 경험을 느껴보고 싶나요?</SignupEmailSubTitle>

      <SignupEmailInputWrap>
        <SignupEmailInputSubWrap>
          <SignupEmailInput
            type={'email'}
            value={email}
            placeholder="이메일"
            onChange={onChangeEmail}
          />
        </SignupEmailInputSubWrap>
        <ProfilePasswordInputWrap>
          <PasswordVisibleInputElement
            password={password}
            onChangePassword={onChangePassword}
            placeholder={SETTING_EDIT_PASSWORD_PHASE_TEXT}
            onKeyDown={handleKeyPress}
          />
          {!isVerifedEmail && (
            <SignupMinAgeWrap>
              <SignupMinAgeCheck>비밀번호가 틀립니다.</SignupMinAgeCheck>
            </SignupMinAgeWrap>
          )}
        </ProfilePasswordInputWrap>
      </SignupEmailInputWrap>

      <SignupWrap $height={height}>
        <SignupButton onClick={onOpen}>이메일로 가입하기</SignupButton>
        <BottomNextButton
          title="로그인"
          notActiveTitle="로그인"
          isTransparent={true}
          isActive={isValidString(password) && isValidString(email)}
          actionFunc={onClicLoginEmail}
          BottomNextButtonWrapContainerStyle={{ position: 'static' }}
        />
      </SignupWrap>
    </>
  );
};

const SignupWrap = styled.div<{ $height: number }>`
  width: 100%;
  margin-top: ${(props) => props.$height - 370}px;
`;

const SignupButton = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey5};
  margin-bottom: 10px;
  padding: 2px 4px;
  cursor: pointer;
`;
const SignupEmailSubTitle = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Body2};
  margin-bottom: 20px;
  color: ${({ theme }) => theme.grey.Grey5};
`;

const SignupLogoWrap = styled.div`
  display: flex;
  margin: 0 auto;
  margin-bottom: 5px;
`;

const SignupEmailInputWrap = styled.div`
  margin: 0 20px;
  gap: 20px;
  display: flex;
  flex-flow: column;
`;

const SignupEmailInputSubWrap = styled.div`
  display: flex;
  flex-flow: column;
`;

const SignupEmailInput = styled.input`
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

const ProfilePasswordInput = styled.input`
  padding: 15px 16px;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.grey.Grey1};

  width: 100%;
  box-sizing: border-box;
  outline: none;
  border-radius: 30px;
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const SignupMinAgeWrap = styled.div`
  margin: 7px 0px 0px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  position: absolute;
  bottom: -27px;
`;

const SignupMinAgeCheck = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.errorColor.Red};
`;

export default LoginEmailPopupBody;
