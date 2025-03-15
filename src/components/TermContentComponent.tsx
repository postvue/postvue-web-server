import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import {
  ACCOUNT_SETTING_PRIVACY_POLICY_TAB_NAME,
  ACCOUNT_SETTING_PRIVACY_POLICY_URL,
  ACCOUNT_SETTING_TERMS_OF_SERVICE_URL,
  ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_TAB_NAME,
  ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_URL,
} from 'const/TabConfigConst';
import React from 'react';
import styled from 'styled-components';

const TermContentComponent: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <TermsWrap>
      <TermItem style={{ cursor: 'auto' }}>© {currentYear}</TermItem>
      <TermItem
        onClick={() => {
          window.open(
            ACCOUNT_SETTING_TERMS_OF_SERVICE_URL,
            '_blank',
            'noopener,noreferrer',
          );
        }}
      >
        {APP_SERVICE_NAME} 약관
      </TermItem>
      <TermItem
        onClick={() => {
          window.open(
            ACCOUNT_SETTING_PRIVACY_POLICY_URL,
            '_blank',
            'noopener,noreferrer',
          );
        }}
      >
        {ACCOUNT_SETTING_PRIVACY_POLICY_TAB_NAME}
      </TermItem>
      <TermItem
        onClick={() => {
          window.open(
            ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_URL,
            '_blank',
            'noopener,noreferrer',
          );
        }}
      >
        {ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_TAB_NAME}
      </TermItem>
    </TermsWrap>
  );
};

const TermsWrap = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  margin: 0 auto;
  left: 50%;
  transform: translate(-50%, 0);
  gap: 10px;
`;

const TermItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  font-size: 13px;
  color: ${({ theme }) => theme.grey.Grey4};
  white-space: nowrap;
  cursor: pointer;
`;

export default TermContentComponent;
