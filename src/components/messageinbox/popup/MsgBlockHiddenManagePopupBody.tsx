import {
  MSG_BLOCK_LIST_MANAGE_PATH,
  MSG_HIDDEN_LIST_MANAGE_PATH,
} from 'const/PathConst';
import {
  MSG_BLOCK_LIST_TAB_NAME,
  MSG_HIDDEN_LIST_TAB_NAME,
} from 'const/TabConfigConst';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface MsgBlockHiddenManagePopupBodyProps {
  BlockedHiddenManageContainerStyle?: React.CSSProperties;
}

const MsgBlockHiddenManagePopupBody: React.FC<
  MsgBlockHiddenManagePopupBodyProps
> = ({ BlockedHiddenManageContainerStyle }) => {
  return (
    <BlockedHiddenManageContainer style={BlockedHiddenManageContainerStyle}>
      <BlockedHiddenManageWrap>
        <Link to={MSG_HIDDEN_LIST_MANAGE_PATH}>
          <BlockedHiddenManage>{MSG_HIDDEN_LIST_TAB_NAME}</BlockedHiddenManage>
        </Link>
      </BlockedHiddenManageWrap>
      <MsgBlockListManageWrap>
        <Link to={MSG_BLOCK_LIST_MANAGE_PATH}>
          <MsgBlockListManage>{MSG_BLOCK_LIST_TAB_NAME}</MsgBlockListManage>
        </Link>
      </MsgBlockListManageWrap>
    </BlockedHiddenManageContainer>
  );
};

const BlockedHiddenManageContainer = styled.div`
  margin: 0px 0 20px 20px;
  z-index: 100;
`;
const BlockedHiddenManageWrap = styled.div`
  padding-bottom: 28px;
`;

const BlockedHiddenManage = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: pointer;
`;

const MsgBlockListManageWrap = styled.div``;

const MsgBlockListManage = styled(BlockedHiddenManage)``;

export default MsgBlockHiddenManagePopupBody;
