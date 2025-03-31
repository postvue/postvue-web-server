import { ReactComponent as FeelogAppBannerLogo } from 'assets/images/icon/svg/logo/FeelogAppBannerLogo.svg';
import {
  APP_SCHEME_LINK,
  APP_SERVICE_KO_NAME,
  APP_SERVICE_NAME,
  FALLBACK_IOS_APPSTORE_LINK,
} from 'const/AppInfoConst';
import { isApp } from 'global/util/reactnative/nativeRouter';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

const AppBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIosMobile = /iphone/.test(ua);

    if (!isApp() && isIosMobile) {
      setIsVisible(true);
    }
  }, []);

  const handleClick = () => {
    window.location.href = APP_SCHEME_LINK;

    setTimeout(() => {
      window.location.href = FALLBACK_IOS_APPSTORE_LINK;
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        borderBottom: `0.5px solid ${theme.grey.Grey2}`,
      }}
    >
      <AppBannerConatiner>
        <FeelogAppBannerLogo />
        <AppTitleWrap>
          <AppTitle>
            {APP_SERVICE_NAME} - {APP_SERVICE_KO_NAME}
          </AppTitle>
          <AppSubTitle>{APP_SERVICE_NAME} 앱에서 열기</AppSubTitle>
        </AppTitleWrap>
      </AppBannerConatiner>
      <AppOpenButton onClick={handleClick}>열기</AppOpenButton>
    </div>
  );
};

const AppBannerConatiner = styled.div`
  display: flex;
  gap: 15px;
`;

const AppTitleWrap = styled.div``;

const AppTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  color: black;
  font-size: 12px;
`;

const AppSubTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey4};
`;

const AppOpenButton = styled.button`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: white;
  border: none;

  background-color: #007aff;
  border-radius: 20px;

  padding: 3px 13px;
  text-align: center;
`;

export default AppBanner;
