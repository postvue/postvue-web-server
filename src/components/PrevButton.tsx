import React from 'react';
import { NAVIGATION_BACK } from '../const/AppConst';
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
}

const PrevButton: React.FC<PrevBtnProps> = ({
  isApp = false,
  to = location.pathname,
  type = NAVIGATION_BACK,
  style,
}) => {
  return (
    <AppLink isApp={isApp} to={to} type={type} style={style || PrevStyle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M15 6L9 12L15 18"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </AppLink>
  );
};

export default PrevButton;
