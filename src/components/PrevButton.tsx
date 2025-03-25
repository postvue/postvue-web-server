import { ReactComponent as PrevButtonIcon } from 'assets/images/icon/svg/PrevButtonIcon.svg';
import { EVENT_DATA_ROUTE_BACK_TYPE } from 'const/ReactNativeConst';
import React from 'react';
import styled from 'styled-components';
import AppLink from './AppLink';

const PrevStyle: React.CSSProperties = {
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
};

interface PrevBtnProps {
  to?: string;
  type?: string;
  screenName?: string;
  style?: React.CSSProperties;
}

const PrevButton: React.FC<PrevBtnProps> = ({
  to = location.pathname,
  type = EVENT_DATA_ROUTE_BACK_TYPE,
  screenName,
  style,
}) => {
  return (
    <AppLink
      screenName={screenName}
      to={to}
      type={type}
      style={style || PrevStyle}
    >
      <PrevButtonWrap>
        <PrevButtonIcon />
      </PrevButtonWrap>
    </AppLink>
  );
};

const PrevButtonWrap = styled.div`
  display: flex;
  margin: auto 0;

  &::before {
    content: '';
    position: absolute;
    top: -15px;
    bottom: -15px;
    left: -15px;
    right: -15px;
    z-index: -1; /* 가상 요소를 버튼 뒤로 배치 */
    background: transparent; /* 투명 */
  }
`;

export default PrevButton;
