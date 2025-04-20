import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import BottomNextButton from 'components/common/buttton/BottomNextButton';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { STATUS_UNAUTHORIZED_CODE } from 'const/HttpStatusConst';
import {
  SETTING_EDIT_BUTTON_PHASE_TEXT,
  SETTING_EDIT_CHECK_PASSWORD_PHASE_TEXT,
  SETTING_EDIT_CURRENT_PASSWORD_PHASE_TEXT,
  SETTING_EDIT_PASSWORD_PHASE_TEXT,
} from 'const/SystemPhraseConst';
import { isValidPassword } from 'global/util/ValidUtil';
import { QueryMutationPutMyProfilePasswordInfo } from 'hook/queryhook/QueryMutationPutMyProfilePasswordInfo';
import PasswordVisibleInputElement from './PasswordVisibleInputElement';
import ProfileVerifyPasswordBody from './ProfileVerifyPasswordBody';

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
          <PasswordVisibleInputElement
            password={currentPassword}
            onChangePassword={onChangeCurrentPassword}
            placeholder={SETTING_EDIT_CURRENT_PASSWORD_PHASE_TEXT}
          />
          {/* <ProfileIsForgetCurrentPasswordTitle>
            비밀번호를 잊으셨나요?
          </ProfileIsForgetCurrentPasswordTitle> */}
        </ProfileCurrentPasswordSubContainer>
        <BoundaryStickBar />

        <ProfileEditPasswordSubContainer>
          <PasswordVisibleInputElement
            password={password}
            onChangePassword={onChangePassword}
            placeholder={SETTING_EDIT_PASSWORD_PHASE_TEXT}
            isNewPassword={true}
          />
          <PasswordVisibleInputElement
            password={checkPassword}
            onChangePassword={onChangeCheckPassword}
            placeholder={SETTING_EDIT_CHECK_PASSWORD_PHASE_TEXT}
            isNewPassword={true}
          />
        </ProfileEditPasswordSubContainer>

        <ProfileVerifyPasswordBody
          password={password}
          checkPassword={checkPassword}
          ContainerStyle={{ paddingLeft: '20px' }}
        />

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
    </>
  );
};

const ProfileEditPasswordContainer = styled.div`
  padding-top: calc(30px + env(safe-area-inset-top));
`;

const ProfileCurrentPasswordSubContainer = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  padding-bottom: 10px;
`;

const ProfileIsForgetCurrentPasswordTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey5};
  padding-left: 5px;
  padding-top: 5px;
  cursor: pointer;
`;

const ProfileEditPasswordSubContainer = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  display: flex;
  flex-flow: column;
  gap: 20px;
  padding: 10px 0 20px 0;
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
