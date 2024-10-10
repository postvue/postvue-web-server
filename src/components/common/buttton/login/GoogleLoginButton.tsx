import { ReactComponent as GoogleLoginIcon } from 'assets/images/icon/svg/login/GoogleLoginIcon.svg';
import { GOOGLE_LOGIN_TITLE_NAME } from 'const/TabConfigConst';
import React from 'react';
import styled from 'styled-components';

const KakaoLoginButton: React.FC = () => {
  return (
    <LoginElementWrap>
      <LoginElementLogoWrap>
        <GoogleLoginIcon />
      </LoginElementLogoWrap>
      <LoginElementTitle>{GOOGLE_LOGIN_TITLE_NAME}</LoginElementTitle>
    </LoginElementWrap>
  );
};

const LoginElementWrap = styled.div`
  display: flex;
  padding: 14px 0;
  border-radius: 16px;
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  position: relative;
  cursor: pointer;
  color: ${({ theme }) => theme.mainColor.Black};
  background-color: ${({ theme }) => theme.snsColor.Google};
`;

const LoginElementLogoWrap = styled.div`
  padding-left: 12px;
`;

const LoginElementTitle = styled.div`
  position: absolute;
  position: absolute;
  left: 50%;
  top: 13%;
  transform: translate(-50%, 50%);
  font: ${({ theme }) => theme.fontSizes.Subhead2};
`;

export default KakaoLoginButton;
