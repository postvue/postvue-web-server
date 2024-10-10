import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getProfileInfo } from 'services/profile/getProfileInfo';
import BodyFixScrollElement from '../components/BodyFixScrollElement';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MsgConversationBody from '../components/messageconversation/MsgConversationBody';
import MsgConversationHeader from '../components/messageconversation/header/MsgConversationHeader';
import { MsgConversation } from '../global/interface/message';
import {
  ProfileInfoByDirectMsg,
  ProfileMyInfo,
} from '../global/interface/profile';
import { getMyAccountSettingInfo } from '../global/util/MyAccountSettingUtil';
import msgConversationWsService from '../services/message/MsgConversationWsService';
import {
  msgConversationListAtom,
  profileInfoByDirectMsgAtom,
} from '../states/MessageAtom';
import { msgInboxMessageHashMapAtom } from '../states/MsgInboxAtom';

const MessageConversationPage: React.FC = () => {
  const param = useParams();
  const targetUsername = param.user_id;
  const [msgInboxMessageHashMap, setMsgInboxMessageHashMap] = useRecoilState(
    msgInboxMessageHashMapAtom,
  );
  const [msgConversationList, setMsgConversationList] = useRecoilState(
    msgConversationListAtom,
  );
  const [profileInfoByDirectMsg, setProfileInfoByDirectMsg] = useRecoilState(
    profileInfoByDirectMsgAtom,
  );
  const [sessionId, setSessionId] = useState<string>('');

  const myAccountSettingInfo: ProfileMyInfo = getMyAccountSettingInfo();

  useEffect(() => {
    if (!targetUsername) return;

    const selectedfollowInfo = msgInboxMessageHashMap.get(targetUsername);

    if (selectedfollowInfo !== undefined) {
      const tempFollowInfo: ProfileInfoByDirectMsg = {
        targetUserId: selectedfollowInfo.targetUserId,
        username: selectedfollowInfo.username,
        profilePath: selectedfollowInfo.profilePath,
      };
      setProfileInfoByDirectMsg(tempFollowInfo);

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
    } else {
      getProfileInfo(targetUsername).then((otherProfileInfo) => {
        const otherProfileInfoByDm: ProfileInfoByDirectMsg = {
          targetUserId: otherProfileInfo.userId,
          username: otherProfileInfo.username,
          profilePath: otherProfileInfo.profilePath,
        };
        setProfileInfoByDirectMsg(otherProfileInfoByDm);

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
      });
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
