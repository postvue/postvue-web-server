import React, { ReactNode } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

interface HeaderLayoutProps {
  children: ReactNode;
  HeaderLayoutStyle?: React.CSSProperties;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  children,
  HeaderLayoutStyle,
}) => {
  return (
    <HeaderLayoutContainer style={HeaderLayoutStyle}>
      {children}
    </HeaderLayoutContainer>
  );
};

const HeaderLayoutContainer = styled.div`
  height: ${theme.systemSize.header.height};
  display: flex;
  width: 100%;
  position: sticky;
  top: 0px;
  z-index: 100;
  background-color: white;
`;

export default HeaderLayout;
