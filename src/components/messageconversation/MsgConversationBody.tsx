import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { INIT_SCROLL_POSITION } from '../../const/AttributeConst';
import { MsgConversation } from '../../global/interface/message';
import { convertDate } from '../../global/util/DateTimeUtil';
import MsgConversationInfiniteScroll from '../../hook/MsgConversationInfiniteScroll';
import {
  isSettingByMsgConversationAtom,
  msgConversationListAtom,
  msgReactionInfoAtom,
  profileInfoByDirectMsgAtom,
} from '../../states/MessageAtom';
import FollowConversationMsg from './body/FollowConversationMsg';
import FollowConversationReaction from './body/FollowConversationReaction';
import MsgConversationSendMessage from './body/MsgConversationSendMessageButton';
import MyConversationMsg from './body/MyConversationMsg';
import MsgConversationSettingPopup from './popup/MsgConversationSettingPopup';

const MsgConversationBody: React.FC = () => {
  const profileInfoByDirectMsg = useRecoilValue(profileInfoByDirectMsgAtom);
  const [msgConversationList, setMsgConversationList] = useRecoilState(
    msgConversationListAtom,
  );
  const [isSettingByMsgConversation, setIsSettingByMsgConversation] =
    useRecoilState(isSettingByMsgConversationAtom);

  const [msgReactionInfo, setMsgReactionInfo] =
    useRecoilState(msgReactionInfoAtom);
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
      const userId = message.isFollowMsg
        ? profileInfoByDirectMsg.targetUserId
        : 'me';

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

  useEffect(() => {
    return () => {
      setIsSettingByMsgConversation(false);
    };
  }, []);

  return (
    <>
      <MsgConversationBodyContainer ref={MsgConversationBodyContainerRef}>
        {profileInfoByDirectMsg.targetUserId && (
          <MsgConversationScrollWrap>
            <MsgConversationInfiniteScroll
              targetUserId={profileInfoByDirectMsg.targetUserId}
            />
          </MsgConversationScrollWrap>
        )}
        <MsgConversationListWrap>
          {groupedMessages.map((groupData, index) => (
            <MsgConversationWrap key={index}>
              {groupData.userId === profileInfoByDirectMsg.targetUserId ? (
                <FollowConversationMsg
                  followInfo={profileInfoByDirectMsg}
                  groupData={groupData}
                />
              ) : (
                <MyConversationMsg groupData={groupData} />
              )}
            </MsgConversationWrap>
          ))}
        </MsgConversationListWrap>
        <MsgConversationSendMessage followInfo={profileInfoByDirectMsg} />
        {isSettingByMsgConversation && (
          <MsgConversationSettingPopup
            targetProfileInfo={profileInfoByDirectMsg}
          />
        )}
        {msgReactionInfo.msgId !== '' && <FollowConversationReaction />}
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
