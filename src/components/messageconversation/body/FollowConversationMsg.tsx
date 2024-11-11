import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import { ProfileInfoByDirectMsg } from 'global/interface/profile';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { MsgConversation } from '../../../global/interface/message';
import { convertDiffrenceDateTime } from '../../../global/util/DateTimeUtil';

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
  const [activeMsgReactionPopup, setActiveMsgReactionPopup] = useState<
    boolean | number
  >(false);

  const onDownService = (msgIdx: number) => {
    setActiveMsgReactionPopup(msgIdx);
  };

  const msgContentListRef = useRef<HTMLDivElement[]>([]);

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
                <LongPressToResizeButton
                  resize={0.95}
                  onDownFunc={() => onDownService(idx)}
                >
                  <MsgConversationFollowItem
                    ref={(el) => {
                      if (!el) return;
                      msgContentListRef.current[idx] = el;
                    }}
                  >
                    {msg.msgConversation.msgContent}
                  </MsgConversationFollowItem>
                </LongPressToResizeButton>
                <MsgConversationFollowDate>
                  {convertDiffrenceDateTime(msg.msgConversation.sendAt)}
                </MsgConversationFollowDate>
              </MsgDateWrap>
            ) : (
              <MsgWrap>
                <LongPressToResizeButton
                  resize={0.95}
                  onDownFunc={() => onDownService(idx)}
                >
                  <MsgConversationFollowItem
                    ref={(el) => {
                      if (!el) return;
                      msgContentListRef.current[idx] = el;
                    }}
                  >
                    {msg.msgConversation.msgContent}
                  </MsgConversationFollowItem>
                </LongPressToResizeButton>
              </MsgWrap>
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
  padding: 7px 10px 0 0;
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
  word-break: break-all;
`;

const MsgDateWrap = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
`;

const MsgWrap = styled.div`
  display: flex;
`;

const MsgConversationFollowDate = styled.div`
  color: ${({ theme }) => theme.grey.Grey3};
  margin: 5px 0;
  align-self: center;
  font: ${({ theme }) => theme.fontSizes.Body2};
  margin: auto 0 0 0;

  text-align: start;
  white-space: nowrap;
`;

export default FollowConversationMsg;
