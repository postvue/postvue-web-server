import { queryClient } from 'App';
import { QUERY_STATE_MSG_INBOX_LIST } from 'const/QueryClientConst';

import MsgConversationSettingPopup from 'components/messageconversation/popup/MsgConversationSettingPopup';
import MessageInboxBody from 'components/messageinbox/body/MessageInboxBody';
import MessageInboxHeader from 'components/messageinbox/header/MessageInboxHeader';
import PostCotentZoomPopup from 'components/popups/postzoom/PostContentZoomPopup';
import { STATUS_FORBIDDEN_CODE } from 'const/HttpStatusConst';
import { HOME_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMsgConversationListInfinite } from 'hook/queryhook/QueryStateMsgConversationListInfinite';
import {
  MsgInboxListInterface,
  QueryStateMsgInboxListInfinite,
} from 'hook/queryhook/QueryStateMsgInboxListInfinite';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { postContentZoomPopupInfoAtom } from 'states/PostAtom';
import styled from 'styled-components';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MsgConversationBody from '../components/messageconversation/MsgConversationBody';
import MsgConversationHeader from '../components/messageconversation/header/MsgConversationHeader';
import {
  isSettingByMsgConversationAtom,
  profileInfoByDirectMsgAtom,
} from '../states/MessageAtom';

const MessageDirectConversationPage: React.FC = () => {
  const param = useParams();
  const targetUsername = param.user_id;

  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);

  const [profileInfoByDirectMsg, setProfileInfoByDirectMsg] = useRecoilState(
    profileInfoByDirectMsgAtom,
  );

  const { data: profileInfo, isFetched: isFetchedByProfileInfo } =
    QueryStateProfileInfo(targetUsername || '');
  const { data: msgInboxMessageList } = QueryStateMsgInboxListInfinite();

  const {
    data: msgConversationList,
    isError: isErrorByMsgConversation,
    error: errorByMsgConversation,
  } = QueryStateMsgConversationListInfinite(profileInfo?.userId || '');

  useEffect(() => {
    if (!profileInfo || !msgInboxMessageList) return;

    queryClient.setQueryData(
      [QUERY_STATE_MSG_INBOX_LIST],
      (oldData: MsgInboxListInterface) => {
        if (!oldData) {
          return oldData;
        }
        const updatedPages = oldData.pages.map((page) => {
          const newMsgInboxMessageList = page.map((messageItem) => {
            // 해당하는 메시지를 찾아 새로운 객체로 만들어줌
            if (messageItem.targetUserId === profileInfo.userId) {
              return {
                ...messageItem,
                unreadCount: 0,
              };
            }
            return messageItem;
          });

          return [...newMsgInboxMessageList];
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      },
    );
  }, [msgConversationList]);

  useEffect(() => {
    if (!isErrorByMsgConversation) return;

    if (errorByMsgConversation.status === STATUS_FORBIDDEN_CODE) {
      goBackOrNavigate();
    }
  }, [isErrorByMsgConversation]);

  useEffect(() => {
    if (!profileInfo) return;

    if (profileInfo.isBlockerUser || profileInfo.isBlocked) {
      alert(
        profileInfo.isBlocked
          ? '차단 계정'
          : '비공개 계정' + '과 대화할 수 없습니다.',
      );
      goBackOrNavigate();
    }

    const otherProfileInfoByDm = {
      targetUserId: profileInfo.userId,
      nickname: profileInfo.nickname,
      username: profileInfo.username,
      profilePath: profileInfo.profilePath,
    };
    setProfileInfoByDirectMsg(otherProfileInfoByDm);
  }, [profileInfo]);

  const bodyOverscrollBehavior = useRef<string>('');
  useEffect(() => {
    bodyOverscrollBehavior.current = document.body.style.overscrollBehavior;

    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overscrollBehavior = bodyOverscrollBehavior.current;
      resetPostContentZoomPopupInfo();
    };
  }, []);

  const { windowWidth } = useWindowSize();

  const isSettingByMsgConversation = useRecoilValue(
    isSettingByMsgConversationAtom,
  );

  const postContentZoomPopupInfo = useRecoilValue(postContentZoomPopupInfoAtom);

  const resetPostContentZoomPopupInfo = useResetRecoilState(
    postContentZoomPopupInfoAtom,
  );

  return (
    <AppBaseTemplate
      hasSearchBodyModule={false}
      hasSearchInputModule={false}
      isAppContainerTopMargin={false}
      isAppInsetTopMargin={false}
      isScrollByAppContainer={false}
      slideBarNode={
        <>
          <MessageInboxHeader />
          <MessageInboxBody />
        </>
      }
    >
      {isFetchedByProfileInfo && profileInfo && (
        <MsgConversationWrap
          style={
            windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
              ? {
                  height: `calc(100dvh - ${marginGap * 2}px)`,
                  marginTop: `${marginGap}px`,
                  marginBottom: `${marginGap}px`,
                  borderRadius: `${borderRaidus}px`,
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 20px 0px',
                  animation: `scale-in-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both`,
                }
              : { height: '100dvh' }
          }
        >
          <MsgConversationHeader
            isPrevButton={windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM}
            MsgConversationHeaderStyle={
              windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
                ? {
                    borderRadius: `${borderRaidus}px ${borderRaidus}px 0 0`,
                    position: 'static',
                  }
                : {}
            }
            MsgConversationHeaderSubStyle={{
              borderRadius: `${borderRaidus}px ${borderRaidus}px 0 0`,
            }}
          />
          <MsgConversationBody
            MsgConversationBodyContainerStyle={
              windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
                ? {
                    borderRadius: `0 0 ${borderRaidus}px ${borderRaidus}px`,
                    position: 'static',
                  }
                : {}
            }
            MsgConversationSendMessageStyle={
              windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
                ? {
                    position: 'static',
                    borderRadius: `0 0 ${borderRaidus}px ${borderRaidus}px`,
                  }
                : {}
            }
          />
        </MsgConversationWrap>
      )}
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM &&
        isSettingByMsgConversation && (
          <MsgConversationSettingPopup
            targetProfileInfo={profileInfoByDirectMsg}
          />
        )}
      {postContentZoomPopupInfo.isActive && <PostCotentZoomPopup />}
    </AppBaseTemplate>
  );
};

const marginGap = 10;
const borderRaidus = 20;

const MsgConversationWrap = styled.div`
  display: flex;
  flex-flow: column;
  overflow: hidden;
`;

export default MessageDirectConversationPage;
