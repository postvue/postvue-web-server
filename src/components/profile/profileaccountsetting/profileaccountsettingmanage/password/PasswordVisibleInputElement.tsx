import { ReactComponent as PasswordNotVisibleIcon } from 'assets/images/icon/svg/setting/PasswordNotVisibleIcon.svg';
import { ReactComponent as PasswordVisibleIcon } from 'assets/images/icon/svg/setting/PasswordVisibleIcon.svg';
import React, { useState } from 'react';
import styled from 'styled-components';

interface PasswordVisibleInputElementProps {
  password: string;
  placeholder: string;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isNewPassword?: boolean;
}

const PasswordVisibleInputElement: React.FC<
  PasswordVisibleInputElementProps
> = ({
  password,
  placeholder,
  onChangePassword,
  onKeyDown,
  isNewPassword = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  return (
    <ProfileEditPasswordWrap>
      <ProfileEditPasswordInputWrap>
        <ProfileEditPasswordInput
          value={password}
          type={isPasswordVisible ? 'text' : 'password'}
          onChange={(e) => onChangePassword(e)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (!onKeyDown) return;
            onKeyDown(e);
          }}
          autoComplete={isNewPassword ? 'new-password' : 'current-password'}
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
  );
};

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

const PasswordVisibleWrap = styled.div`
  display: flex;
  margin: auto 0px;
  cursor: pointer;
`;

export default PasswordVisibleInputElement;
