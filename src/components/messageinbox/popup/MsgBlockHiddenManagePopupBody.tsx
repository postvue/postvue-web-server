import {
  MSG_BLOCK_LIST_MANAGE_PATH,
  MSG_HIDDEN_LIST_MANAGE_PATH,
} from 'const/PathConst';
import {
  MSG_BLOCK_LIST_TAB_NAME,
  MSG_HIDDEN_LIST_TAB_NAME,
} from 'const/TabConfigConst';
import { stackRouterPush } from 'global/util/reactnative/StackRouter';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isActiveMsgBlockHiddenManagePopupAtom } from 'states/MsgInboxAtom';
import styled from 'styled-components';

interface MsgBlockHiddenManagePopupBodyProps {
  BlockedHiddenManageContainerStyle?: React.CSSProperties;
}

const MsgBlockHiddenManagePopupBody: React.FC<
  MsgBlockHiddenManagePopupBodyProps
> = ({ BlockedHiddenManageContainerStyle }) => {
  const setIsActiveMsgBlockHiddenManagePopup = useSetRecoilState(
    isActiveMsgBlockHiddenManagePopupAtom,
  );

  const navigate = useNavigate();
  return (
    <BlockedHiddenManageContainer style={BlockedHiddenManageContainerStyle}>
      <BlockedHiddenManageWrap>
        <div
          onClick={() => {
            stackRouterPush(navigate, MSG_HIDDEN_LIST_MANAGE_PATH);
            setIsActiveMsgBlockHiddenManagePopup(false);
          }}
        >
          <BlockedHiddenManage>{MSG_HIDDEN_LIST_TAB_NAME}</BlockedHiddenManage>
        </div>
      </BlockedHiddenManageWrap>
      <MsgBlockListManageWrap>
        <div
          onClick={() => {
            stackRouterPush(navigate, MSG_BLOCK_LIST_MANAGE_PATH);
            setIsActiveMsgBlockHiddenManagePopup(false);
          }}
        >
          <MsgBlockListManage>{MSG_BLOCK_LIST_TAB_NAME}</MsgBlockListManage>
        </div>
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
