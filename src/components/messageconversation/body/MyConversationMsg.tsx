import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { MsgConversation } from '../../../global/interface/message';

import { convertDifferenceDateTimeByString } from 'global/util/DateTimeUtil';
import MyMsgConversationReactionContextPopup from '../popup/MyMsgConversationReactionContextPopup';
import ConversationMsgitem from './ConversationMsgItem';

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
  const [activeMsgReactionPopup, setActiveMsgReactionPopup] = useState<{
    isActive: boolean;
    msgId: number;
  }>({ isActive: false, msgId: 0 });

  const onDownService = (msgIdx: number) => {
    setActiveMsgReactionPopup({ isActive: true, msgId: msgIdx });
  };

  const msgContentListRef = useRef<HTMLDivElement[]>([]);

  return (
    <MsgConversationMeWrap>
      {groupData.group.map((msg, idx) => (
        <React.Fragment key={msg.msgConversation.msgId}>
          {/* 마지막 메시지 */}
          {idx === groupData.group.length - 1 || msg.showDate === true ? (
            <MsgDateWrap key={msg.msgConversation.msgId}>
              <MsgConversationMeDate>
                {convertDifferenceDateTimeByString(msg.msgConversation.sendAt)}
              </MsgConversationMeDate>
              <LongPressToResizeButton
                resize={MsgResize}
                onDownFunc={() => onDownService(idx)}
              >
                <MsgConversationMeItem
                  ref={(el) => {
                    if (!el) return;
                    msgContentListRef.current[idx] = el;
                  }}
                >
                  <ConversationMsgitem
                    isMe={true}
                    msgConversation={msg.msgConversation}
                  />
                </MsgConversationMeItem>
              </LongPressToResizeButton>
              {activeMsgReactionPopup.isActive &&
                activeMsgReactionPopup.msgId === idx &&
                msgContentListRef.current[idx] && (
                  <MyMsgConversationReactionContextPopup
                    setActiveMsgReactionPopup={setActiveMsgReactionPopup}
                    msgConversationReactionContextRef={
                      msgContentListRef.current[idx]
                    }
                    msgText={msg.msgConversation.msgTextContent}
                    msgId={msg.msgConversation.msgId}
                  />
                )}
            </MsgDateWrap>
          ) : (
            <MsgWrap>
              <LongPressToResizeButton
                resize={MsgResize}
                onDownFunc={() => onDownService(idx)}
              >
                <MsgConversationMeItem
                  ref={(el) => {
                    if (!el) return;
                    msgContentListRef.current[idx] = el;
                  }}
                >
                  <ConversationMsgitem
                    isMe={true}
                    msgConversation={msg.msgConversation}
                  />
                </MsgConversationMeItem>
              </LongPressToResizeButton>
              {activeMsgReactionPopup.isActive &&
                activeMsgReactionPopup.msgId === idx &&
                msgContentListRef.current[idx] && (
                  <MyMsgConversationReactionContextPopup
                    setActiveMsgReactionPopup={setActiveMsgReactionPopup}
                    msgConversationReactionContextRef={
                      msgContentListRef.current[idx]
                    }
                    msgText={msg.msgConversation.msgTextContent}
                    msgId={msg.msgConversation.msgId}
                  />
                )}
            </MsgWrap>
          )}
        </React.Fragment>
      ))}
    </MsgConversationMeWrap>
  );
};

const MsgResize = 0.95;

const MsgConversationMeWrap = styled.div`
  display: flex;
  justify-content: end;
  padding: 7px 0 0 0px;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
`;

const MsgConversationMeItem = styled.div``;

const MsgDateWrap = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  position: relative;
`;

const MsgWrap = styled.div`
  display: flex;
  position: relative;
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
  white-space: nowrap;
`;

export default MyConversationMsg;
