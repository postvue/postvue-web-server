import React from 'react';
import styled from 'styled-components';
import { NAVIGATION_BACK } from '../const/AppConst';
import theme from '../styles/theme';
import AppLink from './AppLink';

const PrevStyle: React.CSSProperties = {
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
};

interface PrevBtnProps {
  isApp?: boolean;
  to?: string;
  type?: string;
  style?: React.CSSProperties;
  strokeColor?: string;
}

const PrevButton: React.FC<PrevBtnProps> = ({
  isApp = false,
  to = location.pathname,
  type = NAVIGATION_BACK,
  style,
  strokeColor = theme.mainColor.White,
}) => {
  return (
    <AppLink isApp={isApp} to={to} type={type} style={style || PrevStyle}>
      <PrevIcon
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M15 6L9 12L15 18"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </PrevIcon>
    </AppLink>
  );
};

const PrevIcon = styled.svg`
  margin: auto 0;
`;

export default PrevButton;
