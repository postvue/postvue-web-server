import React from 'react';
import styled from 'styled-components';
import PrevButtonHeaderHeader from '../layouts/PrevButtonHeaderHeader';

const MsgBlockListHeader: React.FC = () => {
  return (
    <MsgBlockListHeaderContainer>
      <PrevButtonHeaderHeader titleName={'차단 관리'} />
      <BoundaryBarStick />
    </MsgBlockListHeaderContainer>
  );
};

const MsgBlockListHeaderContainer = styled.div``;

const BoundaryBarStick = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.grey.Grey2};

  position: fixed;
  top: ${({ theme }) => theme.systemSize.header.height};
`;

export default MsgBlockListHeader;
