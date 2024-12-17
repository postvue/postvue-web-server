import FloatingActionButtonLayout from 'components/layouts/FloatingActionButtonLayout';
import {
  MESSAGE_NONE_ACTION,
  MESSAGE_SCROLL_TO_END_ACTION,
} from 'const/MessageConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import MsgConversationListInfiniteScroll from 'hook/MsgConversationListInfiniteScroll';
import { QueryStateMsgConversationListInfinite } from 'hook/queryhook/QueryStateMsgConversationListInfinite';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import theme from 'styles/theme';
import { INIT_SCROLL_POSITION } from '../../const/AttributeConst';
import { MsgConversation } from '../../global/interface/message';
import { convertDate } from '../../global/util/DateTimeUtil';
import {
  isSettingByMsgConversationAtom,
  msgConversationScrollInfoAtom,
  profileInfoByDirectMsgAtom,
  sendedMsgListInfoAtom,
} from '../../states/MessageAtom';
import FollowConversationMsg from './body/FollowConversationMsg';
import MsgConversationSendMessage from './body/MsgConversationSendMessageButton';
import MyConversationMsg from './body/MyConversationMsg';
import MsgConversationSettingPopup from './popup/MsgConversationSettingPopup';

// 개인 메시지
const MsgConversationBody: React.FC = () => {
  const setMsgConversationScrollInfo = useSetRecoilState(
    msgConversationScrollInfoAtom,
  );
  const profileInfoByDirectMsg = useRecoilValue(profileInfoByDirectMsgAtom);

  const [sendedMsgListInfo, setSendedMsgListInfo] = useRecoilState(
    sendedMsgListInfoAtom,
  );

  const [isSettingByMsgConversation, setIsSettingByMsgConversation] =
    useRecoilState(isSettingByMsgConversationAtom);

  const [msgConversationScrollHeight, setMsgConversationScrollHeight] =
    useState<number>(INIT_SCROLL_POSITION);

  const MsgConversationBodyContainerRef = useRef<HTMLDivElement>(null);

  const { windowWidth } = useWindowSize();

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
      const userId = message.isOtherMsg
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

  const {
    data: msgConversationList,
    isFetched: isFetchedByMsgConversationList,
    isFetching,
  } = QueryStateMsgConversationListInfinite(
    profileInfoByDirectMsg.targetUserId,
  );

  const lastMsgPostionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const [initPage, setInitPage] = useState<boolean>(false);

  // useEffect(() => {
  //   if (!isFetchedByMsgConversationList) return;
  //   const msgConversationBodyContainer =
  //     MsgConversationBodyContainerRef.current;
  //   if (msgConversationBodyContainer) {
  //     msgConversationBodyContainer.scrollTo({
  //       top: msgConversationBodyContainer.scrollHeight,
  //     });
  //   }

  //   setTimeout(() => {
  //     if (!lastMsgPostionRef.current) return;

  //     lastMsgPostionRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }, 100);
  // }, [isFetchedByMsgConversationList]);

  useEffect(() => {
    if (initPage) return;
    const msgConversationBodyContainer =
      MsgConversationBodyContainerRef.current;
    if (msgConversationBodyContainer) {
      msgConversationBodyContainer.scrollTo({
        top: msgConversationBodyContainer.scrollHeight,
      });
    }
    setInitPage(true);
  }, [msgConversationList]);

  useEffect(() => {
    const msgConversationBodyContainer =
      MsgConversationBodyContainerRef.current;

    if (!isFetchedByMsgConversationList) return;

    if (!msgConversationBodyContainer) return;

    setMsgConversationScrollHeight(msgConversationBodyContainer.scrollHeight);

    msgConversationBodyContainer.scrollTo({
      top:
        msgConversationBodyContainer.scrollHeight - msgConversationScrollHeight,
    });
  }, [isFetching]);

  useEffect(() => {
    if (!MsgConversationBodyContainerRef.current) return;
    const msgConversationBodyContainer =
      MsgConversationBodyContainerRef.current;

    const maxScrollPosition =
      msgConversationBodyContainer.scrollHeight -
      (window.innerHeight || 0) -
      MAX_POSITION_GAP;

    setMsgConversationScrollInfo({
      currentPostion: msgConversationBodyContainer.scrollTop,
      maxScrollPosition: maxScrollPosition,
      msgContainerHeight: msgConversationBodyContainer.scrollHeight,
    });

    let animationFrameId: number;
    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        if (!MsgConversationBodyContainerRef.current) return;
        const currentPostion = msgConversationBodyContainer.scrollTop;
        const maxScrollPosition =
          msgConversationBodyContainer.scrollHeight -
          (window.innerHeight || 0) -
          MAX_POSITION_GAP;

        if (currentPostion >= maxScrollPosition) {
          setSendedMsgListInfo({
            unreadMsgNum: 0,
            action: MESSAGE_NONE_ACTION,
          });
        }

        setMsgConversationScrollInfo({
          currentPostion: currentPostion,
          maxScrollPosition: maxScrollPosition,
          msgContainerHeight: msgConversationBodyContainer.scrollHeight,
        });
      });
    };
    msgConversationBodyContainer.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      setIsSettingByMsgConversation(false);
      setInitPage(false);
    };
  }, []);

  useEffect(() => {
    if (sendedMsgListInfo.action === MESSAGE_NONE_ACTION) return;

    if (
      sendedMsgListInfo.action === MESSAGE_SCROLL_TO_END_ACTION &&
      MsgConversationBodyContainerRef.current
    ) {
      MsgConversationBodyContainerRef.current.scrollTo({
        top: MsgConversationBodyContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [sendedMsgListInfo]);
  return (
    <>
      <MsgConversationBodyContainer>
        <MsgConversationListWrap ref={MsgConversationBodyContainerRef}>
          <MsgConversationListSubWrap>
            {profileInfoByDirectMsg.targetUserId && (
              <MsgConversationScrollWrap>
                <MsgConversationListInfiniteScroll
                  targetUserId={profileInfoByDirectMsg.targetUserId}
                />
              </MsgConversationScrollWrap>
            )}
            {msgConversationList &&
              groupMessages(
                msgConversationList.pages
                  .flatMap((v) => v.msgConversationRspList)
                  .slice(0)
                  .reverse()
                  .map(
                    (value) =>
                      ({
                        msgId: value.msgId,
                        msgRoomId: value.msgRoomId,
                        isGroupedMsg: false,
                        targetUserId: profileInfoByDirectMsg.targetUserId,
                        isOtherMsg: value.isOtherMsg,
                        msgType: value.msgType,
                        msgContent: value.msgContent,
                        hasMsgReaction: value.hasMsgReaction,
                        msgReactionType: value.msgReactionType,
                        sendAt: value.sendAt,
                      }) as MsgConversation,
                  ),
              ).map((groupData, index) => {
                return (
                  <MsgConversationWrap key={index}>
                    {groupData.userId ===
                    profileInfoByDirectMsg.targetUserId ? (
                      <FollowConversationMsg
                        followInfo={profileInfoByDirectMsg}
                        groupData={groupData}
                      />
                    ) : (
                      <MyConversationMsg groupData={groupData} />
                    )}
                  </MsgConversationWrap>
                );
              })}
            <LastPositionWrap ref={lastMsgPostionRef} />
          </MsgConversationListSubWrap>
        </MsgConversationListWrap>

        {sendedMsgListInfo.unreadMsgNum > 0 && (
          <UnreadMsgNotifcationWrap>
            <FloatingActionButtonLayout
              bottomByMaxSize={theme.systemSize.bottomNavBar.heightNum}
              bottomGap={10}
              containerRef={MsgConversationBodyContainerRef}
              isActiveDown={false}
              actionFunc={() => {
                if (!MsgConversationBodyContainerRef.current) return;
                MsgConversationBodyContainerRef.current.scrollTo({
                  top: MsgConversationBodyContainerRef.current.scrollHeight,
                  behavior: 'smooth',
                });
              }}
            >
              <UnreadMsgNotifcation>
                {sendedMsgListInfo.unreadMsgNum}개 읽지 않은 메시지
              </UnreadMsgNotifcation>
            </FloatingActionButtonLayout>
          </UnreadMsgNotifcationWrap>
        )}

        <MsgConversationSendMessage
          followInfo={profileInfoByDirectMsg}
          MsgConversationBodyContainerRef={MsgConversationBodyContainerRef}
        />
        {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM && (
          <MsgConversationSettingPopup
            targetProfileInfo={profileInfoByDirectMsg}
          />
        )}
      </MsgConversationBodyContainer>
    </>
  );
};

const MAX_POSITION_GAP = 100;

const MsgConversationBodyContainer = styled.div`
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MsgConversationScrollWrap = styled.div`
  // padding-bottom: 50px;
  // padding-top: 100px;
`;

const MsgConversationListWrap = styled.div`
  position: fixed;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  height: 100vh;
  overflow-y: scroll;
`;

const MsgConversationListSubWrap = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const MsgConversationWrap = styled.div``;

const LastPositionWrap = styled.div`
  padding-bottom: 150px;
`;

const UnreadMsgNotifcationWrap = styled.div``;

const UnreadMsgNotifcation = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};
`;

export default MsgConversationBody;
