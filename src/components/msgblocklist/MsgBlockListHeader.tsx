import { MSG_BLOCK_LIST_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';
import styled from 'styled-components';
import PrevButtonHeaderHeader from '../layouts/PrevButtonHeaderHeader';

const MsgBlockListHeader: React.FC = () => {
  return (
    <MsgBlockListHeaderContainer>
      <PrevButtonHeaderHeader titleName={MSG_BLOCK_LIST_TAB_NAME} />
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
