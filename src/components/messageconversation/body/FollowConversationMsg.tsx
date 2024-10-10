import { ProfileInfoByDirectMsg } from 'global/interface/profile';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { MSG_REACTION_CLASS_NAME } from '../../../const/ClassNameConst';
import {
  MsgConversation,
  MsgReactionInfo,
} from '../../../global/interface/message';
import { convertDiffrenceDateTime } from '../../../global/util/DateTimeUtil';
import { msgReactionInfoAtom } from '../../../states/MessageAtom';
import LongPressReaction from '../../LongPressReaction';

interface FollowConversationMsgProps {
  followInfo: ProfileInfoByDirectMsg;
  groupData: {
    userId: string;
    group: {
      msgConversation: MsgConversation;
      showDate: boolean;
    }[];
  };
}

const FollowConversationMsg: React.FC<FollowConversationMsgProps> = ({
  followInfo,
  groupData,
}) => {
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
        isMyMsg: false,
        msgText: reactionElement?.innerText,
      };
      setMsgReactionInfo(msgReactionInfo);
    }
  };

  return (
    <MsgConversationFollowGroup>
      {groupData.group.length > 0 && (
        <FollowProfileWrap>
          <FollowProfileImg src={followInfo.profilePath} />
        </FollowProfileWrap>
      )}
      <MsgConversationFollowMsgGroup>
        {groupData.group.map((msg, idx) => (
          <React.Fragment key={msg.msgConversation.msgId}>
            {idx === groupData.group.length - 1 || msg.showDate === true ? (
              <MsgDateWrap key={msg.msgConversation.msgId}>
                <LongPressReaction
                  onDownService={() => onDownService(msg.msgConversation.msgId)}
                >
                  <MsgConversationFollowItem>
                    {msg.msgConversation.msgContent}
                  </MsgConversationFollowItem>
                </LongPressReaction>
                <MsgConversationFollowDate>
                  {convertDiffrenceDateTime(msg.msgConversation.sendAt)}
                </MsgConversationFollowDate>
              </MsgDateWrap>
            ) : (
              <>
                <LongPressReaction
                  onDownService={() => onDownService(msg.msgConversation.msgId)}
                >
                  <MsgConversationFollowItem
                    key={msg.msgConversation.msgId}
                    id={`${MSG_REACTION_CLASS_NAME}${msg.msgConversation.msgId}`}
                  >
                    {msg.msgConversation.msgContent}
                  </MsgConversationFollowItem>
                </LongPressReaction>
              </>
            )}
          </React.Fragment>
        ))}
      </MsgConversationFollowMsgGroup>
    </MsgConversationFollowGroup>
  );
};

const MsgConversationFollowGroup = styled.div`
  display: flex;
  justify-content: start;
  padding: 7px 98px 0 0;
  gap: 11px;
`;

const FollowProfileWrap = styled.div``;

const MsgConversationFollowMsgGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`;

const FollowProfileImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 20px;
`;

const MsgConversationFollowItem = styled.div`
  padding: 9px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font: ${({ theme }) => theme.fontSizes.Body4};
  background-color: ${({ theme }) => theme.grey.Grey1};
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

export default FollowConversationMsg;
