import React from 'react';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  MSG_BLOCK_LIST_MANAGE_PATH,
  MSG_HIDDEN_LIST_MANAGE_PATH,
} from '../../../const/PathConst';
import { isFolloManagePopupByMsgInboxAtom } from '../../../states/MsgInboxAtom';
import PopupLayout from '../../layouts/PopupLayout';

const BlockHiddenByMsgInboxPopup: React.FC = () => {
  const setIsFolloManagePopupByMsgInbox = useSetRecoilState(
    isFolloManagePopupByMsgInboxAtom,
  );

  return (
    <PopupLayout setIsPopup={setIsFolloManagePopupByMsgInbox}>
      <FollowHiddenManageContainer>
        <FollowHiddenManageWrap>
          <Link to={MSG_HIDDEN_LIST_MANAGE_PATH}>
            <FollowHiddenManage>숨긴 관리</FollowHiddenManage>
          </Link>
        </FollowHiddenManageWrap>
        <MsgBlockListManageWrap>
          <Link to={MSG_BLOCK_LIST_MANAGE_PATH}>
            <MsgBlockListManage>차단 관리</MsgBlockListManage>
          </Link>
        </MsgBlockListManageWrap>
      </FollowHiddenManageContainer>
    </PopupLayout>
  );
};

const FollowHiddenManageContainer = styled.div`
  padding: 59px 0 61px 20px;
`;
const FollowHiddenManageWrap = styled.div`
  padding-bottom: 28px;
`;

const FollowHiddenManage = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: pointer;
`;

const MsgBlockListManageWrap = styled.div``;

const MsgBlockListManage = styled(FollowHiddenManage)``;

export default BlockHiddenByMsgInboxPopup;
