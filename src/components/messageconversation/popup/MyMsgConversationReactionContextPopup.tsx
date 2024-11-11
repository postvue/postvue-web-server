import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import { onClickClipBoardCopyButton } from 'global/util/ToastUtil';
import React from 'react';
import msgConversationWsService from 'services/message/MsgConversationWsService';
import styled from 'styled-components';

interface MyMsgConversationReactionContextPopupProps {
  msgConversationReactionContextRef: HTMLDivElement;
  setActiveMsgReactionPopup: React.Dispatch<
    React.SetStateAction<number | boolean>
  >;
  msgText: string;
  msgId: string;
}
const MyMsgConversationReactionContextPopup: React.FC<
  MyMsgConversationReactionContextPopupProps
> = ({
  msgConversationReactionContextRef,
  setActiveMsgReactionPopup,
  msgText,
  msgId,
}) => {
  const onClickDeleteMsg = (msgId: string) => {
    msgConversationWsService.deleteMessage(msgId);
    setActiveMsgReactionPopup(false);
  };

  return (
    <ContextMenuPopup
      setIsActive={setActiveMsgReactionPopup}
      contextMenuRef={msgConversationReactionContextRef}
    >
      <MsgReactionPopupWrap>
        <ReactionCopyButton
          onClick={() => {
            setActiveMsgReactionPopup(false);
            onClickClipBoardCopyButton(msgText);
          }}
        >
          복사
        </ReactionCopyButton>
        <BoundaryStickBar />
        <ReactionDeleteButton onClick={() => onClickDeleteMsg(msgId)}>
          삭제
        </ReactionDeleteButton>
      </MsgReactionPopupWrap>
    </ContextMenuPopup>
  );
};

const MsgReactionPopupWrap = styled.div``;

const ReactionCopyButton = styled.div`
  padding: 12px 16px;
  font: ${({ theme }) => theme.fontSizes.Body3};
  cursor: pointer;
`;

const ReactionDeleteButton = styled(ReactionCopyButton)``;

export default MyMsgConversationReactionContextPopup;
