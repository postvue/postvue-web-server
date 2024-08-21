import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import styled from 'styled-components';
import { copyClipBoard } from '../../../global/util/CopyUtil';
import msgConversationWsService from '../../../services/message/MsgConversationWsService';
import {
  followInfoByMsgAtom,
  msgReactionInfoAtom,
} from '../../../states/MessageAtom';

interface msgReactionPositionInterface {
  top: number;
  xForward: string;
  isShow: boolean;
}

const FollowConversationReaction: React.FC = () => {
  const MsgReactionRef = useRef<HTMLDivElement>(null);
  const msgReactionInfo = useRecoilValue(msgReactionInfoAtom);
  const followInfo = useRecoilValue(followInfoByMsgAtom);

  const resetMsgReactionInfo = useResetRecoilState(msgReactionInfoAtom);

  const reactionPaddingY = 4;

  const [msgReactionPosition, setMsgReactionPosition] =
    useState<msgReactionPositionInterface>({
      top: 0,
      xForward: 'left',
      isShow: false,
    });

  msgReactionInfo.y > msgReactionInfo.height / 2;

  const onClickDeleteMsg = (targetUserId: string, msgId: string) => {
    msgConversationWsService.deleteMessage(targetUserId, msgId);
    resetMsgReactionInfo();
  };

  const onClickMsgCopy = (copyText: string) => {
    copyClipBoard(copyText);
    resetMsgReactionInfo();
  };

  useEffect(() => {
    if (MsgReactionRef.current) {
      const newMsgReactionPosition: msgReactionPositionInterface = {
        ...msgReactionPosition,
      };
      if (
        msgReactionInfo.y + msgReactionInfo.msgHeight / 2 >
        msgReactionInfo.height / 2
      ) {
        newMsgReactionPosition.top = msgReactionInfo.y - 88 - reactionPaddingY;
      } else {
        newMsgReactionPosition.top =
          msgReactionInfo.y + msgReactionInfo.msgHeight + reactionPaddingY;
      }

      if (msgReactionInfo.isMyMsg) {
        newMsgReactionPosition.xForward = 'right';
      } else {
        newMsgReactionPosition.xForward = 'left';
      }
      newMsgReactionPosition.isShow = true;
      setMsgReactionPosition(newMsgReactionPosition);
    }
  }, [msgReactionInfo]);

  return (
    <MsgReactionContainer onClick={() => resetMsgReactionInfo()}>
      <MsgReactionPopupWrap
        ref={MsgReactionRef}
        $isShow={msgReactionPosition.isShow}
        $top={msgReactionPosition.top}
        $xForward={msgReactionPosition.xForward}
        onClick={(e) => e.stopPropagation()}
      >
        <ReactionCopyButton
          onClick={() => onClickMsgCopy(msgReactionInfo.msgText)}
        >
          복사
        </ReactionCopyButton>
        <ReactionBoundaryStickBar />
        <ReactionDeleteButton
          onClick={() =>
            onClickDeleteMsg(followInfo.targetUserId, msgReactionInfo.msgId)
          }
        >
          삭제
        </ReactionDeleteButton>
      </MsgReactionPopupWrap>
    </MsgReactionContainer>
  );
};

const MsgReactionContainer = styled.div`
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  position: fixed;
  z-index: 999;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const MsgReactionPopupWrap = styled.div<{
  $top: number;
  $xForward: string;
  $isShow: boolean;
}>`
    display: ${(props) => (props.$isShow ? 'block' : 'none')};
    width: 161px;
    height: 88px;
  top: ${(props) => props.$top}px;
  ${(props) => props.$xForward}: 0;
  margin-${(props) => props.$xForward}: 20px;
  position: absolute;


  border-radius: 12px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.20);
  background-color:${({ theme }) => theme.mainColor.White}
`;
const ReactionBoundaryStickBar = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.grey.Grey2};
`;

const ReactionCopyButton = styled.div`
  padding: 12px 16px;
  font: ${({ theme }) => theme.fontSizes.Body3};
  cursor: pointer;
`;

const ReactionDeleteButton = styled(ReactionCopyButton)``;
export default FollowConversationReaction;
