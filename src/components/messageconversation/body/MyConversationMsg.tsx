import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { MSG_REACTION_CLASS_NAME } from '../../../const/ClassNameConst';
import {
  MsgConversation,
  MsgReactionInfo,
} from '../../../global/interface/message';
import { convertDiffrenceDate } from '../../../global/util/DateTimeUtil';
import { msgReactionInfoAtom } from '../../../states/MessageAtom';
import LongPressReaction from '../../LongPressReaction';

interface MyConversationMsgProps {
  groupData: {
    userId: string;
    group: {
      msgConversation: MsgConversation;
      showDate: boolean;
    }[];
  };
}

const MyConversationMsg: React.FC<MyConversationMsgProps> = ({ groupData }) => {
  const setMsgReactionInfo = useSetRecoilState(msgReactionInfoAtom);
  const onDownService = (msgId: string) => {
    const reactionElement = document.getElementById(
      `${MSG_REACTION_CLASS_NAME}${msgId}`,
    );

    if (reactionElement !== null) {
      const dom = reactionElement.getBoundingClientRect();
      const body = document.body;

      const msgReactionInfo: MsgReactionInfo = {
        msgId: msgId,
        msgHeight: dom.height,
        y: dom.y,
        height: body.offsetHeight,
        isMyMsg: true,
        msgText: reactionElement?.innerText,
      };
      setMsgReactionInfo(msgReactionInfo);
    }
  };

  return (
    <MsgConversationMeWrap>
      {groupData.group.map((msg, idx) => (
        <React.Fragment key={msg.msgConversation.msgId}>
          {idx === groupData.group.length - 1 || msg.showDate === true ? (
            <MsgDateWrap key={msg.msgConversation.msgId}>
              <MsgConversationMeDate>
                {convertDiffrenceDate(msg.msgConversation.sendAt)}
              </MsgConversationMeDate>
              <LongPressReaction
                onDownService={() => onDownService(msg.msgConversation.msgId)}
              >
                <MsgConversationMeItem
                  id={`${MSG_REACTION_CLASS_NAME}${msg.msgConversation.msgId}`}
                >
                  {msg.msgConversation.msgContent}
                </MsgConversationMeItem>
              </LongPressReaction>
            </MsgDateWrap>
          ) : (
            <>
              <LongPressReaction
                onDownService={() => onDownService(msg.msgConversation.msgId)}
              >
                <MsgConversationMeItem
                  key={msg.msgConversation.msgId}
                  id={`${MSG_REACTION_CLASS_NAME}${msg.msgConversation.msgId}`}
                >
                  {msg.msgConversation.msgContent}
                </MsgConversationMeItem>
              </LongPressReaction>
            </>
          )}
        </React.Fragment>
      ))}
    </MsgConversationMeWrap>
  );
};

const MsgConversationMeWrap = styled.div`
  display: flex;
  justify-content: end;
  padding: 7px 0 0 0px;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
`;

const MsgConversationMeItem = styled.div`
  padding: 9px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font: ${({ theme }) => theme.fontSizes.Body4};
  background-color: ${({ theme }) => theme.mainColor.Blue};
  color: ${({ theme }) => theme.mainColor.White};
  border-radius: 20px;
  max-width: 259px;
`;

const MsgDateWrap = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
`;

const MsgConversationFollowDate = styled.div`
  color: ${({ theme }) => theme.grey.Grey3};
  margin: 5px 0;
  align-self: center;
  font: ${({ theme }) => theme.fontSizes.Body2};
  margin: auto 0 0 0;

  text-align: start;
`;

const MsgConversationMeDate = styled(MsgConversationFollowDate)`
  text-align: end;
`;

export default MyConversationMsg;
