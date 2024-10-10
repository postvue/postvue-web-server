import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as PasswordNotVisibleIcon } from 'assets/images/icon/svg/setting/PasswordNotVisibleIcon.svg';
import { ReactComponent as PasswordVisibleIcon } from 'assets/images/icon/svg/setting/PasswordVisibleIcon.svg';
import { ReactComponent as PasswordValidCheckIcon } from 'assets/images/icon/svg/signup/SignupCheckIcon.svg';
import { ReactComponent as PasswordNotValidCheckIcon } from 'assets/images/icon/svg/signup/SignupNotCheckIcon.svg';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import ToastPopup from 'components/popups/ToastMsgPopup';
import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { STATUS_UNAUTHORIZED_CODE } from 'const/HttpStatusConst';
import {
  SIGNUP_PASSWORD_MAX_SIZE,
  SIGNUP_PASSWORD_MIN_SIZE,
  SIGNUP_PASSWORD_SPECIAL_CHAR_CHECK_FILTER,
} from 'const/SignupConst';
import {
  SETTING_EDIT_BUTTON_PHASE_TEXT,
  SETTING_EDIT_CHECK_PASSWORD_PHASE_TEXT,
  SETTING_EDIT_CURRENT_PASSWORD_PHASE_TEXT,
  SETTING_EDIT_PASSWORD_PHASE_TEXT,
} from 'const/SystemPhraseConst';
import {
  checkFirstCharIsLetterRegexByPassword,
  checkLengthByPassword,
  checkSpecialCharRegexByPassword,
  checkValidCharsRegexByPassword,
  isValidPassword,
  isValidString,
} from 'global/util/ValidUtil';
import { QueryMutationPutMyProfilePasswordInfo } from 'hook/queryhook/QueryMutationPutMyProfilePasswordInfo';
import theme from 'styles/theme';

const ProfileAccountPasswordEditBody: React.FC = () => {
  const [isClickButton, setIsClickButton] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>(
    INIT_EMPTY_STRING_VALUE,
  );
  const [password, setPassword] = useState<string>(INIT_EMPTY_STRING_VALUE);
  const [checkPassword, setCheckPassword] = useState<string>(
    INIT_EMPTY_STRING_VALUE,
  );

  const bottomNextButtonRef = useRef<HTMLDivElement>(null);

  const [unauthorizedErrorInfo, setUnauthorizedErrorInfo] = useState<{
    isUnauthorizedError: boolean;
    errorMessage: string;
  }>({ isUnauthorizedError: false, errorMessage: '' });

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isCheckPasswordVisible, setIsCheckPasswordVisible] =
    useState<boolean>(false);

  const putProfilePasswordInfoMutation =
    QueryMutationPutMyProfilePasswordInfo();

  const onChangeCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsClickButton(false);
    setCurrentPassword(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeCheckPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(e.target.value);
  };

  const onClickEditPassword = () => {
    if (password === checkPassword && isValidPassword(password)) {
      putProfilePasswordInfoMutation.mutate(
        {
          currentPassword: currentPassword,
          password: password,
        },
        {
          onError: (error: any) => {
            if (error.response?.status === STATUS_UNAUTHORIZED_CODE) {
              setUnauthorizedErrorInfo({
                isUnauthorizedError: true,
                errorMessage: error.response?.data.message,
              });
              setIsClickButton(true);
            }
          },
        },
      );
    }
  };

  const [bottomHeight, setBottomHeight] = useState<number>(0);

  useEffect(() => {
    setBottomHeight(bottomNextButtonRef.current?.offsetHeight || 0);
  }, [bottomNextButtonRef.current]);

  return (
    <>
      <ProfileEditPasswordContainer>
        <ProfileCurrentPasswordSubContainer>
          <ProfileEditPasswordWrap>
            <ProfileEditPasswordInputWrap>
              <ProfileEditPasswordInput
                value={currentPassword}
                type={isCurrentPasswordVisible ? 'text' : 'password'}
                onChange={(e) => onChangeCurrentPassword(e)}
                placeholder={SETTING_EDIT_CURRENT_PASSWORD_PHASE_TEXT}
              />
              <PasswordVisibleWrap
                onClick={() => {
                  setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
                }}
              >
                {isCurrentPasswordVisible ? (
                  <PasswordVisibleIcon />
                ) : (
                  <PasswordNotVisibleIcon />
                )}
              </PasswordVisibleWrap>
            </ProfileEditPasswordInputWrap>
          </ProfileEditPasswordWrap>
          <ProfileIsForgetCurrentPasswordTitle>
            비밀번호를 잊으셨나요?
          </ProfileIsForgetCurrentPasswordTitle>
        </ProfileCurrentPasswordSubContainer>
        <BoundaryStickBar />

        <ProfileEditPasswordSubContainer>
          <ProfileEditPasswordWrap>
            <ProfileEditPasswordInputWrap>
              <ProfileEditPasswordInput
                value={password}
                type={isPasswordVisible ? 'text' : 'password'}
                onChange={(e) => onChangePassword(e)}
                placeholder={SETTING_EDIT_PASSWORD_PHASE_TEXT}
              />
              <PasswordVisibleWrap
                onClick={() => {
                  setIsPasswordVisible(!isPasswordVisible);
                }}
              >
                {isPasswordVisible ? (
                  <PasswordVisibleIcon />
                ) : (
                  <PasswordNotVisibleIcon />
                )}
              </PasswordVisibleWrap>
            </ProfileEditPasswordInputWrap>
          </ProfileEditPasswordWrap>
          <ProfileEditPasswordWrap>
            <ProfileEditPasswordInputWrap>
              <ProfileEditPasswordInput
                value={checkPassword}
                type={isCheckPasswordVisible ? 'text' : 'password'}
                onChange={(e) => onChangeCheckPassword(e)}
                placeholder={SETTING_EDIT_CHECK_PASSWORD_PHASE_TEXT}
              />
              <PasswordVisibleWrap
                onClick={() => {
                  setIsCheckPasswordVisible(!isCheckPasswordVisible);
                }}
              >
                {isCheckPasswordVisible ? (
                  <PasswordVisibleIcon />
                ) : (
                  <PasswordNotVisibleIcon />
                )}
              </PasswordVisibleWrap>
            </ProfileEditPasswordInputWrap>
          </ProfileEditPasswordWrap>
        </ProfileEditPasswordSubContainer>

        <PasswordValidCheckWrap>
          {checkLengthByPassword(password) ? (
            <PasswordValidCheckIcon />
          ) : (
            <PasswordNotValidCheckIcon />
          )}
          <PasswordValidTitle>
            최소 {SIGNUP_PASSWORD_MIN_SIZE}자 최대{SIGNUP_PASSWORD_MAX_SIZE}자
          </PasswordValidTitle>
        </PasswordValidCheckWrap>

        <PasswordValidCheckWrap>
          {checkFirstCharIsLetterRegexByPassword(password) ? (
            <PasswordValidCheckIcon />
          ) : (
            <PasswordNotValidCheckIcon />
          )}
          <PasswordValidTitle>
            첫 글자는 영문으로 해야합니다.
          </PasswordValidTitle>
        </PasswordValidCheckWrap>
        <PasswordValidCheckWrap>
          {checkSpecialCharRegexByPassword(password) ? (
            <PasswordValidCheckIcon />
          ) : (
            <PasswordNotValidCheckIcon />
          )}
          <PasswordValidTitle>
            특수 문자가 하나 이상 포함되어야 합니다.
          </PasswordValidTitle>
        </PasswordValidCheckWrap>
        <PasswordValidCheckWrap>
          {checkValidCharsRegexByPassword(password) ? (
            <PasswordValidCheckIcon />
          ) : (
            <PasswordNotValidCheckIcon />
          )}
          <PasswordValidTitle>
            영어와 숫자만 가능, 특수 문자는{' '}
            {SIGNUP_PASSWORD_SPECIAL_CHAR_CHECK_FILTER}만 가능
          </PasswordValidTitle>
        </PasswordValidCheckWrap>
        <PasswordValidCheckWrap>
          {isValidString(password) && password === checkPassword ? (
            <PasswordValidCheckIcon />
          ) : (
            <PasswordNotValidCheckIcon />
          )}
          <PasswordValidTitle>비밀번호가 일치해야 합니다.</PasswordValidTitle>
        </PasswordValidCheckWrap>

        {isClickButton && unauthorizedErrorInfo.isUnauthorizedError && (
          <UnauthorizedErrorFocusWrap $bottom={bottomHeight}>
            <UnauthorizedErrorFocus>
              {unauthorizedErrorInfo.errorMessage}
            </UnauthorizedErrorFocus>
          </UnauthorizedErrorFocusWrap>
        )}
        <BottomNextButton
          title={SETTING_EDIT_BUTTON_PHASE_TEXT}
          notActiveTitle={SETTING_EDIT_BUTTON_PHASE_TEXT}
          isActive={isValidPassword(password) && password === checkPassword}
          actionFunc={onClickEditPassword}
          bottomNextButtonRef={bottomNextButtonRef}
        />
      </ProfileEditPasswordContainer>
      <ToastPopup backgroundColor={theme.mainColor.Black} />
    </>
  );
};

const ProfileEditPasswordContainer = styled.div`
  padding-top: calc(${({ theme }) => theme.systemSize.header.height} + 30px);
`;

const ProfileCurrentPasswordSubContainer = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  padding-bottom: 10px;
`;

const ProfileIsForgetCurrentPasswordTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey5};
  padding-left: 5px;
  cursor: pointer;
`;

const ProfileEditPasswordSubContainer = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  display: flex;
  flex-flow: column;
  gap: 20px;
  padding: 10px 0 20px 0;
`;

const ProfileEditPasswordWrap = styled.div``;

const ProfileEditPasswordInputWrap = styled.div`
  padding: 15px 16px;
  background-color: ${({ theme }) => theme.mainColor.White};
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  box-sizing: border-box;

  border-radius: 30px;

  display: flex;
  gap: 10px;
`;

const ProfileEditPasswordInput = styled.input`
  width: 100%;
  outline: none;
  font: ${({ theme }) => theme.fontSizes.Body2};
  border: 0px;
`;

const PasswordValidCheckWrap = styled.div`
  margin: 7px 0px 0px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  display: flex;
  gap: 11px;
`;

const PasswordValidTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey8};
`;

const PasswordVisibleWrap = styled.div`
  display: flex;
  margin: auto 0px;
  cursor: pointer;
`;

const UnauthorizedErrorFocusWrap = styled.div<{ $bottom: number }>`
  position: fixed;
  bottom: ${(props) => props.$bottom}px;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  color: ${({ theme }) => theme.errorColor.Red};
  font: ${({ theme }) => theme.fontSizes.Body2};
  text-align: center;
`;

const UnauthorizedErrorFocus = styled.div``;

export default ProfileAccountPasswordEditBody;
