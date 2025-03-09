import { queryClient } from 'App';
import {
  MSG_BLOCK_LIST_MANAGE_PATH,
  MSG_HIDDEN_LIST_MANAGE_PATH,
  PROFILE_LIST_PATH,
} from 'const/PathConst';
import { QUERY_STATE_MSG_INBOX_LIST } from 'const/QueryClientConst';
import { ProfileInfoByDirectMsg } from 'global/interface/profile';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { putBlockingUser } from 'services/message/putBlockingUser';
import { putHiddenUser } from 'services/message/putHiddenUser';
import { isSettingByMsgConversationAtom } from 'states/MessageAtom';
import styled from 'styled-components';

interface MsgConversationSettingPopupBodyProps {
  targetProfileInfo: ProfileInfoByDirectMsg;
  MsgSettingContainerStyle?: React.CSSProperties;
}
const MsgConversationSettingPopupBody: React.FC<
  MsgConversationSettingPopupBodyProps
> = ({ targetProfileInfo, MsgSettingContainerStyle }) => {
  const navigate = useNavigate();

  const setIsSettingByMsgConversation = useSetRecoilState(
    isSettingByMsgConversationAtom,
  );

  const onClickHidingUser = (targetUserId: string) => {
    putHiddenUser(targetUserId).then(() => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_MSG_INBOX_LIST],
      });
      navigate(MSG_HIDDEN_LIST_MANAGE_PATH, { replace: true });
    });
  };

  const onClickBlockingUser = (targetUserId: string) => {
    putBlockingUser(targetUserId).then(() => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_MSG_INBOX_LIST],
      });
      navigate(MSG_BLOCK_LIST_MANAGE_PATH, { replace: true });
    });
  };
  return (
    <MsgSettingContainer style={MsgSettingContainerStyle}>
      <AlarmManageWrap>
        <AlarmManage>알림 끄기</AlarmManage>
      </AlarmManageWrap>
      <ProfileShowWrap>
        <div
          onClick={() => {
            setIsSettingByMsgConversation(false);

            navigate(`${PROFILE_LIST_PATH}/${targetProfileInfo.username}`);
          }}
        >
          <ProfileShow>프로필 보기</ProfileShow>
        </div>
      </ProfileShowWrap>
      <ProfileHiddenWrap>
        <ProfileHidden
          onClick={() => onClickHidingUser(targetProfileInfo.targetUserId)}
        >
          숨김 추가
        </ProfileHidden>
      </ProfileHiddenWrap>
      <ProfileBlockWrap>
        <ProfileBlock
          onClick={() => onClickBlockingUser(targetProfileInfo.targetUserId)}
        >
          사용자 차단
        </ProfileBlock>
      </ProfileBlockWrap>
    </MsgSettingContainer>
  );
};

const MsgSettingContainer = styled.div`
  padding: 0px 0 20px 20px;
  display: flex;
  gap: 28px;
  flex-flow: column;
`;
const AlarmManageWrap = styled.div``;

const AlarmManage = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: pointer;
`;

const ProfileShowWrap = styled.div``;

const ProfileShow = styled(AlarmManage)``;

const ProfileBlockWrap = styled.div``;

const ProfileBlock = styled(AlarmManage)``;

const ProfileHiddenWrap = styled.div``;

const ProfileHidden = styled(AlarmManage)``;

export default MsgConversationSettingPopupBody;
