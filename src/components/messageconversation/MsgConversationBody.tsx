import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { INIT_SCROLL_POSITION } from '../../const/AttributeConst';
import { MsgConversation } from '../../global/interface/message';
import { convertDate } from '../../global/util/DateTimeUtil';
import MsgConversationInfiniteScroll from '../../hook/MsgConversationInfiniteScroll';
import {
  followInfoByMsgAtom,
  msgConversationListAtom,
} from '../../states/MessageAtom';
import FollowConversationMsg from './body/FollowConversationMsg';
import MsgConversationSendMessage from './body/MsgConversationSendMessageButton';
import MyConversationMsg from './body/MyConversationMsg';

const MsgConversationBody: React.FC = () => {
  const followInfo = useRecoilValue(followInfoByMsgAtom);
  const [msgConversationList, setMsgConversationList] = useRecoilState(
    msgConversationListAtom,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [msgConversationScrollHeight, setMsgConversationScrollHeight] =
    useState<number>(INIT_SCROLL_POSITION);

  const MsgConversationBodyContainerRef = useRef<HTMLDivElement | null>(null);

  const MINUTE_MS = 60 * 1000;
  const groupMessages = (
    messages: MsgConversation[],
  ): {
    userId: string;
    group: { msgConversation: MsgConversation; showDate: boolean }[];
  }[] => {
    const grouped: {
      userId: string;
      group: { msgConversation: MsgConversation; showDate: boolean }[];
    }[] = [];
    let currentGroup: {
      msgConversation: MsgConversation;
      showDate: boolean;
    }[] = [];
    let lastDate: Date = new Date();
    let lastUserId: string | null = null;

    messages.forEach((message) => {
      const userId = message.isFollowMsg ? followInfo.followUserId : 'me';

      if (lastUserId === null) {
        currentGroup.push({ msgConversation: message, showDate: true });
        lastDate = convertDate(message.sendAt);
        lastUserId = userId;
        return;
      }
      if (lastUserId !== userId) {
        grouped.push({
          userId: lastUserId,
          group: currentGroup,
        });

        currentGroup = [];
      }
      const showDate =
        convertDate(message.sendAt).getTime() - lastDate.getTime() > MINUTE_MS;
      currentGroup.push({ msgConversation: message, showDate: showDate });
      lastDate = convertDate(message.sendAt);
      lastUserId = userId;
    });

    if (currentGroup.length > 0 && lastUserId !== null) {
      grouped.push({
        userId: lastUserId,
        group: currentGroup,
      });
    }

    return grouped;
  };

  const messages: MsgConversation[] = msgConversationList
    .slice(0)
    .reverse()
    .map((value) => ({ ...value, key: value.msgId }));

  const groupedMessages: {
    userId: string;
    group: { msgConversation: MsgConversation; showDate: boolean }[];
  }[] = groupMessages(messages);

  useEffect(() => {
    const msgConversationBodyContainer =
      MsgConversationBodyContainerRef.current;
    if (
      msgConversationBodyContainer &&
      msgConversationList.length > 0 &&
      isInitialLoad
    ) {
      msgConversationBodyContainer.scrollTop =
        msgConversationBodyContainer.scrollHeight;
      setIsInitialLoad(false);
      setMsgConversationScrollHeight(msgConversationBodyContainer.scrollHeight);
    }
    if (!isInitialLoad && msgConversationBodyContainer) {
      msgConversationBodyContainer.scrollTop =
        msgConversationBodyContainer.scrollHeight -
        msgConversationScrollHeight +
        msgConversationBodyContainer.scrollTop;
    }
  }, [isInitialLoad, msgConversationList]);

  return (
    <>
      <MsgConversationBodyContainer ref={MsgConversationBodyContainerRef}>
        {followInfo.followUserId && (
          <MsgConversationScrollWrap>
            <MsgConversationInfiniteScroll
              targetUserId={followInfo.followUserId}
            />
          </MsgConversationScrollWrap>
        )}
        <MsgConversationListWrap>
          {groupedMessages.map((groupData, index) => (
            <MsgConversationWrap key={index}>
              {groupData.userId === followInfo.followUserId ? (
                <FollowConversationMsg
                  followInfo={followInfo}
                  groupData={groupData}
                />
              ) : (
                <MyConversationMsg groupData={groupData} />
              )}
            </MsgConversationWrap>
          ))}
        </MsgConversationListWrap>
        <MsgConversationSendMessage followInfo={followInfo} />
      </MsgConversationBodyContainer>
    </>
  );
};

const MsgConversationBodyContainer = styled.div`
  overflow: scroll;
  height: calc(100vh - 58px);

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MsgConversationScrollWrap = styled.div`
  margin-bottom: 50px;
`;

const MsgConversationListWrap = styled.div`
  padding: 0 20px 100px 20px;
`;

const MsgConversationWrap = styled.div``;

export default MsgConversationBody;
