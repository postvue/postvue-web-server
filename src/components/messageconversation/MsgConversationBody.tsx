import FloatingActionButtonLayout from 'components/layouts/FloatingActionButtonLayout';
import {
  MESSAGE_NONE_ACTION,
  MESSAGE_SCROLL_TO_END_ACTION,
} from 'const/MessageConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
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

interface MsgConversationBodyProps {
  MsgConversationBodyContainerStyle?: React.CSSProperties;
  MsgConversationSendMessageStyle?: React.CSSProperties;
}

// 개인 메시지
const MsgConversationBody: React.FC<MsgConversationBodyProps> = ({
  MsgConversationBodyContainerStyle,
  MsgConversationSendMessageStyle,
}) => {
  const setMsgConversationScrollInfo = useSetRecoilState(
    msgConversationScrollInfoAtom,
  );
  const profileInfoByDirectMsg = useRecoilValue(profileInfoByDirectMsgAtom);

  const [sendedMsgListInfo, setSendedMsgListInfo] = useRecoilState(
    sendedMsgListInfoAtom,
  );

  const setIsSettingByMsgConversation = useSetRecoilState(
    isSettingByMsgConversationAtom,
  );

  const [msgConversationScrollHeight, setMsgConversationScrollHeight] =
    useState<number>(INIT_SCROLL_POSITION);

  const MsgConversationBodyContainerRef = useRef<HTMLDivElement>(null);

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
  } = QueryStateMsgConversationListInfinite(
    profileInfoByDirectMsg.targetUserId,
  );

  const lastMsgPostionRef = useRef<HTMLDivElement>(null);
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
    const msgConversationBodyContainer =
      MsgConversationBodyContainerRef.current;

    if (
      !isFetchedByMsgConversationList ||
      !msgConversationBodyContainer ||
      !testRef.current
    )
      return;

    // 크기 측정 함수
    const measureSize = () => {
      if (msgConversationBodyContainer && testRef.current) {
        const height = msgConversationBodyContainer.scrollHeight;

        setMsgConversationScrollHeight(height);

        msgConversationBodyContainer.scrollTo({
          top: height - msgConversationScrollHeight,
        });
      }
    };

    // ResizeObserver 설정
    const observer = new ResizeObserver(() => {
      measureSize();
    });

    observer.observe(testRef.current);

    // 초기 측정
    measureSize();

    return () => {
      observer.disconnect(); // 컴포넌트 언마운트 시 관찰 해제
    };
  }, [isFetchedByMsgConversationList]);

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
      setMsgConversationScrollHeight(INIT_SCROLL_POSITION);
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

  const testRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <MsgConversationBodyContainer
        ref={MsgConversationBodyContainerRef}
        style={MsgConversationBodyContainerStyle}
      >
        <MsgConversationListWrap>
          <MsgConversationListSubWrap ref={testRef}>
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
                  .map((value) => {
                    const msgConversation: MsgConversation = {
                      msgId: value.msgId,
                      msgRoomId: value.msgRoomId,
                      isGroupedMsg: false,
                      targetUserId: profileInfoByDirectMsg.targetUserId,
                      isOtherMsg: value.isOtherMsg,
                      msgTextContent: value.msgTextContent,
                      hasMsgMedia: value.hasMsgMedia,
                      msgMediaType: value.msgMediaType,
                      msgMediaContent: value.msgMediaContent,
                      hasMsgReaction: value.hasMsgReaction,
                      msgLinkMetaInfo: value.msgLinkMetaInfo,
                      msgReactionType: value.msgReactionType,
                      sendAt: value.sendAt,
                    };
                    return msgConversation;
                  }),
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
      </MsgConversationBodyContainer>
      <MsgConversationSendMessage
        followInfo={profileInfoByDirectMsg}
        MsgConversationBodyContainerRef={MsgConversationBodyContainerRef}
        MsgConversationSendMessageStyle={MsgConversationSendMessageStyle}
      />
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
  flex: 1;

  overflow: auto;
`;

const MsgConversationScrollWrap = styled.div`
  // padding-bottom: 50px;
  // padding-top: 100px;
`;

const MsgConversationListWrap = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${theme.systemSize.appDisplaySize.widthByPc};
  }
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
