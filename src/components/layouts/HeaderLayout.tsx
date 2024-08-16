import React, { ReactNode } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

interface HeaderLayoutProps {
  children: ReactNode;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ children }) => {
  return <HeaderLayoutContainer>{children}</HeaderLayoutContainer>;
};

const HeaderLayoutContainer = styled.div`
  height: ${theme.systemSize.header.height};
  display: flex;
  width: 100%;
  position: fixed;
  z-index: 100;
  max-width: ${theme.systemSize.appDisplaySize.maxWidth};
  background-color: white;
`;

export default HeaderLayout;
