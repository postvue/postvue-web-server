import { atom } from 'recoil';
import { INIT_CURSOR_ID, PAGE_NUM } from '../const/PageConfigConst';
import { MsgConversation, MsgInboxMessage } from '../global/interface/message';
import { FollowProfileInfo } from '../global/interface/profile';

export const msgInboxMessageHashMapAtom = atom<Map<string, MsgInboxMessage>>({
  key: 'msgInboxMessageHashMap',
  default: new Map(),
});

export const pageNumAtomByMsgInboxMessage = atom<number>({
  key: 'pageNumByMsgInboxMessage',
  default: PAGE_NUM,
});

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
