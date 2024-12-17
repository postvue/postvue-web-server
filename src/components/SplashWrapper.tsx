import { ReactComponent as SplashFeelogLogo } from 'assets/images/icon/svg/logo/SplashFeelogLogo.svg';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface SplashWrapperProps {
  children: React.ReactNode;
}

const SplashWrapper: React.FC<SplashWrapperProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SplashWrapperContainer>
      {loading ? (
        <div style={splashScreenStyle}>
          <SplashFeelogLogo />
        </div>
      ) : (
        children
      )}
    </SplashWrapperContainer>
  );
};

const SplashWrapperContainer = styled.div``;

const splashScreenStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100dvh',
  backgroundColor: 'white',
  color: 'white',
};

export default SplashWrapper;
