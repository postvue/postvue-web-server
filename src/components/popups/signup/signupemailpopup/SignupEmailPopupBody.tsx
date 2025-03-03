import { ReactComponent as FeelogLogo } from 'assets/images/icon/svg/logo/FeelogLargeLogo.svg';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import LoadingPopup from 'components/popups/LoadingPopup';
import PasswordVisibleInputElement from 'components/profile/profileaccountsetting/profileaccountsettingmanage/password/PasswordVisibleInputElement';
import ProfileVerifyPasswordBody from 'components/profile/profileaccountsetting/profileaccountsettingmanage/password/ProfileVerifyPasswordBody';
import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import {
  SETTING_EDIT_CHECK_PASSWORD_PHASE_TEXT,
  SETTING_EDIT_PASSWORD_PHASE_TEXT,
} from 'const/SystemPhraseConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { isValidEmail, isValidPassword } from 'global/util/ValidUtil';
import React, { useState } from 'react';
import { postAuthSignupEmail } from 'services/auth/postAuthSignupEmail';
import { getProfileExistenceByEmail } from 'services/profile/getProfileExistenceByEmail';
import styled from 'styled-components';

interface SignupEmailPOpupBodyProps {
  onOpen: () => void;
}

const SignupEmailPopupBody: React.FC<SignupEmailPOpupBodyProps> = ({
  onOpen,
}) => {
  const [email, setEmail] = useState<string>(INIT_EMPTY_STRING_VALUE);

  const [existEmail, setExistEmail] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingBySignupEmail, setLoadingBySignupEmail] =
    useState<boolean>(false);

  const [password, setPassword] = useState<string>(INIT_EMPTY_STRING_VALUE);
  const [checkPassword, setCheckPassword] = useState<string>(
    INIT_EMPTY_STRING_VALUE,
  );

  const debounceSetEmail = getSearchQueryByDebounce(
    (word) => {
      if (!isValidEmail(word)) {
        setLoading(false);
      } else {
        getProfileExistenceByEmail(word)
          .then((value) => {
            setExistEmail(value.isExisted);
          })
          .finally(() => setLoading(false));
      }
    },
    [],
    300,
  );

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setEmail(e.target.value);
    debounceSetEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeCheckPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(e.target.value);
  };

  const onClickSignupEmail = () => {
    setLoadingBySignupEmail(true);

    postAuthSignupEmail({
      email: email,
      password: password,
    })
      .then(() => {
        onOpen();
      })
      .finally(() => {
        setLoadingBySignupEmail(false);
      });
  };
  return (
    <SignupContainer>
      {/* <SignupEmailTitle>Feelog</SignupEmailTitle> */}
      <SignupLogoWrap>
        <SignupLogoSubWrap>
          <FeelogLogo />
        </SignupLogoSubWrap>
      </SignupLogoWrap>
      <SignupEmailSubTitle>Feelog</SignupEmailSubTitle>
      <SignupEmailInputWrap>
        <SignupEmailInputSubWrap>
          <SignupEmailInput
            type={'email'}
            value={email}
            placeholder="이메일"
            onChange={onChangeEmail}
          />
          {!loading && email !== '' && !isValidEmail(email) ? (
            <SignupMinAgeWrap>
              <SignupMinAgeCheck>
                올바른 이메일 형식이 아닙니다.
              </SignupMinAgeCheck>
            </SignupMinAgeWrap>
          ) : (
            <>
              {!loading && existEmail && (
                <SignupMinAgeWrap>
                  <SignupMinAgeCheck>
                    사용할 수 없는 이메일입니다.
                  </SignupMinAgeCheck>
                </SignupMinAgeWrap>
              )}
            </>
          )}
        </SignupEmailInputSubWrap>
        <ProfilePasswordInputWrap>
          <PasswordVisibleInputElement
            password={password}
            onChangePassword={onChangePassword}
            placeholder={SETTING_EDIT_PASSWORD_PHASE_TEXT}
          />
          <PasswordVisibleInputElement
            password={checkPassword}
            onChangePassword={onChangeCheckPassword}
            placeholder={SETTING_EDIT_CHECK_PASSWORD_PHASE_TEXT}
          />
          <ProfileVerifyPasswordBody
            password={password}
            checkPassword={checkPassword}
          />
        </ProfilePasswordInputWrap>
      </SignupEmailInputWrap>
      <BottomNextButton
        title="계속하기"
        notActiveTitle="계속하기"
        isTransparent={true}
        isActive={
          isValidPassword(password) &&
          password === checkPassword &&
          isValidEmail(email) &&
          !existEmail
        }
        actionFunc={onClickSignupEmail}
        BottomNextButtonWrapContainerStyle={{ position: 'static' }}
      />
      {loadingBySignupEmail && <LoadingPopup />}
    </SignupContainer>
  );
};

const SignupContainer = styled.div`
  display: flex;
  height: calc(100% - 40px);
  flex-direction: column;
`;

const SignupEmailSubTitle = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  margin-bottom: 20px;
`;

const SignupLogoWrap = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const SignupLogoSubWrap = styled.div`
  display: flex;
  margin: 0 auto;
`;

const SignupEmailInputWrap = styled.div`
  margin: 0 20px;
  gap: 20px;
  display: flex;
  flex-flow: column;
  flex: 1;
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
  gap: 10px;
`;

const SignupMinAgeWrap = styled.div`
  margin: 7px 0px 0px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SignupMinAgeCheck = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.errorColor.Red};
`;

export default SignupEmailPopupBody;
