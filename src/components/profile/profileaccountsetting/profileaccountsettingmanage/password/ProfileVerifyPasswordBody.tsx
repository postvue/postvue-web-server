import { ReactComponent as PasswordValidCheckIcon } from 'assets/images/icon/svg/signup/SignupCheckIcon.svg';
import { ReactComponent as PasswordNotValidCheckIcon } from 'assets/images/icon/svg/signup/SignupNotCheckIcon.svg';
import {
  SIGNUP_PASSWORD_MAX_SIZE,
  SIGNUP_PASSWORD_MIN_SIZE,
  SIGNUP_PASSWORD_SPECIAL_CHAR_CHECK_FILTER,
} from 'const/SignupConst';
import {
  checkFirstCharIsLetterRegexByPassword,
  checkLengthByPassword,
  checkSpecialCharRegexByPassword,
  checkValidCharsRegexByPassword,
  isValidString,
} from 'global/util/ValidUtil';
import React from 'react';
import styled from 'styled-components';

interface ProfileVerifyPasswordBodyProps {
  password: string;
  checkPassword: string;
  ContainerStyle?: React.CSSProperties;
}

const ProfileVerifyPasswordBody: React.FC<ProfileVerifyPasswordBodyProps> = ({
  password,
  checkPassword,
  ContainerStyle,
}) => {
  return (
    <PasswordValidContainer style={ContainerStyle}>
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
        <PasswordValidTitle>첫 글자는 영문으로 해야합니다.</PasswordValidTitle>
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
    </PasswordValidContainer>
  );
};

const PasswordValidContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PasswordValidCheckWrap = styled.div`
  margin: 7px 0px 0px 0px;
  display: flex;
  gap: 11px;
`;

const PasswordValidTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey8};
`;

export default ProfileVerifyPasswordBody;
