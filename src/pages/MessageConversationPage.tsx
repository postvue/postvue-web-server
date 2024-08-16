import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import BodyFixScrollElement from '../components/BodyFixScrollElement';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MsgConversationBody from '../components/messageconversation/MsgConversationBody';
import MsgConversationHeader from '../components/messageconversation/header/MsgConversationHeader';
import { MsgConversation } from '../global/interface/message';
import { FollowProfileInfo } from '../global/interface/profile';
import msgConversationWsService from '../services/message/MsgConversationWsService';
import { getProfileFollowInfo } from '../services/profile/getProfileFollowInfo';
import {
  followInfoByMsgAtom,
  msgConversationListAtom,
  msgInboxMessageHashMapAtom,
} from '../states/MessageAtom';

const MessageConversationPage: React.FC = () => {
  const param = useParams();
  const followUsername = param.user_id;
  const msgInboxMessageHashMap = useRecoilValue(msgInboxMessageHashMapAtom);
  const [msgConversationList, setMsgConversationList] = useRecoilState(
    msgConversationListAtom,
  );
  const [followInfo, setFollowInfo] = useRecoilState(followInfoByMsgAtom);

  useEffect(() => {
    if (followUsername) {
      const selectedfollowInfo = msgInboxMessageHashMap.get(followUsername);
      let msgSessionId = '';
      if (selectedfollowInfo !== undefined) {
        const tempFollowInfo: FollowProfileInfo = {
          followUserId: selectedfollowInfo.followUserId,
          username: selectedfollowInfo.username,
          profilePath: selectedfollowInfo.profilePath,
          msgSessionId: selectedfollowInfo.msgSessionId,
        };
        msgSessionId = selectedfollowInfo.msgSessionId;
        setFollowInfo(tempFollowInfo);
        if (msgSessionId) {
          msgConversationWsService.connect(
            tempFollowInfo,
            (message: MsgConversation) => {
              setMsgConversationList((prev) => [...[message], ...prev]);
            },
            (messageId: string) => {
              setMsgConversationList((prev) =>
                prev.filter((v) => v.msgId !== messageId),
              );
            },
          );
        }
      } else {
        getProfileFollowInfo(followUsername).then((followProfileInfo) => {
          setFollowInfo(followProfileInfo);
          msgSessionId = followProfileInfo.msgSessionId;
          if (msgSessionId) {
            msgConversationWsService.connect(
              followProfileInfo,
              (message: MsgConversation) => {
                setMsgConversationList((prev) => [...[message], ...prev]);
              },
              (messageId: string) => {
                setMsgConversationList((prev) =>
                  prev.filter((v) => v.msgId !== messageId),
                );
              },
            );
          }
        });
      }
    }

    return () => {
      msgConversationWsService.disconnect();
    };
  }, []);

  return (
    <AppBaseTemplate>
      <MsgConversationHeader />
      <MsgConversationBody />
      <BodyFixScrollElement />
    </AppBaseTemplate>
  );
};

export default MessageConversationPage;
