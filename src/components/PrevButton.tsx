import { ReactComponent as PrevButtonIcon } from 'assets/images/icon/svg/PrevButtonIcon.svg';
import React from 'react';
import styled from 'styled-components';
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
  strokeColor?: string;
}

const PrevButton: React.FC<PrevBtnProps> = ({
  isApp = false,
  to = location.pathname,
  type = NAVIGATION_BACK,
  style,
}) => {
  return (
    <AppLink isApp={isApp} to={to} type={type} style={style || PrevStyle}>
      <PrevButtonWrap>
        <PrevButtonIcon />
      </PrevButtonWrap>
    </AppLink>
  );
};

const PrevButtonWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default PrevButton;
