import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import BodyFixScrollElement from '../components/BodyFixScrollElement';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MsgConversationBody from '../components/messageconversation/MsgConversationBody';
import MsgConversationHeader from '../components/messageconversation/header/MsgConversationHeader';
import { MyAccountSettingInterface } from '../global/interface/localstorage/MyAccountSettingInterface';
import { MsgConversation } from '../global/interface/message';
import { TargetProfileInfo } from '../global/interface/profile';
import { getMyAccountSettingInfo } from '../global/util/MyAccountSettingUtil';
import msgConversationWsService from '../services/message/MsgConversationWsService';
import { getProfileFollowInfo } from '../services/profile/getProfileFollowInfo';
import {
  followInfoByMsgAtom,
  msgConversationListAtom,
} from '../states/MessageAtom';
import { msgInboxMessageHashMapAtom } from '../states/MsgInboxAtom';

const MessageConversationPage: React.FC = () => {
  const param = useParams();
  const followUsername = param.user_id;
  const msgInboxMessageHashMap = useRecoilValue(msgInboxMessageHashMapAtom);
  const [msgConversationList, setMsgConversationList] = useRecoilState(
    msgConversationListAtom,
  );
  const [followInfo, setFollowInfo] = useRecoilState(followInfoByMsgAtom);
  const [sessionId, setSessionId] = useState<string>('');

  const myAccountSettingInfo: MyAccountSettingInterface =
    getMyAccountSettingInfo();

  useEffect(() => {
    if (followUsername) {
      const selectedfollowInfo = msgInboxMessageHashMap.get(followUsername);
      let msgSessionId = '';
      if (selectedfollowInfo !== undefined) {
        const tempFollowInfo: TargetProfileInfo = {
          targetUserId: selectedfollowInfo.targetUserId,
          username: selectedfollowInfo.username,
          profilePath: selectedfollowInfo.profilePath,
          msgRoomId: selectedfollowInfo.msgRoomId,
        };
        msgSessionId = selectedfollowInfo.msgRoomId;
        setFollowInfo(tempFollowInfo);
        if (msgSessionId) {
          msgConversationWsService.connect(
            (message: MsgConversation) => {
              setMsgConversationList((prev) => [...[message], ...prev]);
            },
            (messageId: string) => {
              setMsgConversationList((prev) =>
                prev.filter((v) => v.msgId !== messageId),
              );
            },
            setSessionId,
            myAccountSettingInfo,
          );
        }
      } else {
        getProfileFollowInfo(followUsername).then((followProfileInfo) => {
          setFollowInfo(followProfileInfo);
          msgSessionId = followProfileInfo.msgRoomId;
          if (msgSessionId) {
            msgConversationWsService.connect(
              (message: MsgConversation) => {
                setMsgConversationList((prev) => [...[message], ...prev]);
              },
              (messageId: string) => {
                setMsgConversationList((prev) =>
                  prev.filter((v) => v.msgId !== messageId),
                );
              },
              setSessionId,
              myAccountSettingInfo,
            );
          }
        });
      }
    }

    return () => {
      msgConversationWsService.disconnect(sessionId);
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
