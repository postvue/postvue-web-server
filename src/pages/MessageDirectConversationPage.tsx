import { queryClient } from 'App';
import { QUERY_STATE_MSG_INBOX_LIST } from 'const/QueryClientConst';

import { QueryStateMsgConversationListInfinite } from 'hook/queryhook/QueryStateMsgConversationListInfinite';
import {
  MsgInboxListInterface,
  QueryStateMsgInboxListInfinite,
} from 'hook/queryhook/QueryStateMsgInboxListInfinite';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MsgConversationBody from '../components/messageconversation/MsgConversationBody';
import MsgConversationHeader from '../components/messageconversation/header/MsgConversationHeader';
import { profileInfoByDirectMsgAtom } from '../states/MessageAtom';

const MessageDirectConversationPage: React.FC = () => {
  const param = useParams();
  const targetUsername = param.user_id;

  const [profileInfoByDirectMsg, setProfileInfoByDirectMsg] = useRecoilState(
    profileInfoByDirectMsgAtom,
  );

  const { data: profileInfo, isFetched: isFetchedByProfileInfo } =
    QueryStateProfileInfo(targetUsername || '');
  const { data: msgInboxMessageList } = QueryStateMsgInboxListInfinite();

  const { data: msgConversationList } = QueryStateMsgConversationListInfinite(
    profileInfo?.userId || '',
  );

  useEffect(() => {
    if (!targetUsername || !profileInfo) return;

    const otherProfileInfoByDm = {
      targetUserId: profileInfo.userId,
      username: profileInfo.username,
      profilePath: profileInfo.profilePath,
    };
    setProfileInfoByDirectMsg(otherProfileInfoByDm);
  }, [isFetchedByProfileInfo]);

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

  return (
    <AppBaseTemplate>
      <MsgConversationHeader />
      <MsgConversationBody />
      {/* @REFER: BodyFixScroll 삭제 유무 */}
      {/* <BodyFixScrollElement /> */}
    </AppBaseTemplate>
  );
};

export default MessageDirectConversationPage;
