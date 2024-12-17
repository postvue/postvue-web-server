import React from 'react';
import styled from 'styled-components';
import PrevButtonHeaderHeader from '../layouts/PrevButtonHeaderHeader';

const MsgHiddenListHeader: React.FC = () => {
  return (
    <MsgHiddenListHeaderContainer>
      <PrevButtonHeaderHeader titleName={'숨김 목록'} />
      <BoundaryBarStick />
    </MsgHiddenListHeaderContainer>
  );
};

const MsgHiddenListHeaderContainer = styled.div``;

const BoundaryBarStick = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.grey.Grey2};

  position: fixed;
  top: ${({ theme }) => theme.systemSize.header.height};
`;

export default MsgHiddenListHeader;
