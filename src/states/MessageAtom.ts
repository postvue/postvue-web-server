import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { MsgConversation } from '../global/interface/message';
import { FollowProfileInfo } from '../global/interface/profile';

export const followInfoByMsgAtom = atom<FollowProfileInfo>({
  key: 'followInfoByMsg',
  default: {
    msgSessionId: '',
    followUserId: '',
    username: '',
    profilePath: '',
  },
});

export const msgConversationListAtom = atom<MsgConversation[]>({
  key: 'msgConversationHashMap',
  default: [],
});

export const cursorIdAtomByMsgConversation = atom<string>({
  key: 'cursorIdAtomByMsgConversation',
  default: INIT_CURSOR_ID,
});
