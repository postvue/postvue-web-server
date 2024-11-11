import { MESSAGE_NONE_ACTION } from 'const/MessageConst';
import { ProfileInfoByDirectMsg } from 'global/interface/profile';
import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { MsgBlockHiddenUser } from '../global/interface/message';

export const profileInfoByDirectMsgAtom = atom<ProfileInfoByDirectMsg>({
  key: 'profileInfoByDirectMsg',
  default: {
    targetUserId: '',
    username: '',
    profilePath: '',
  },
});

// export const msgConversationListAtom = atom<MsgConversation[]>({
//   key: 'msgConversationHashMap',
//   default: [],
// });

export const cursorIdAtomByMsgConversation = atom<string>({
  key: 'cursorIdAtomByMsgConversation',
  default: INIT_CURSOR_ID,
});

export const msgBlockUserHashMapAtom = atom<Map<string, MsgBlockHiddenUser>>({
  key: 'msgBlockUserHashMap',
  default: new Map(),
});

export const cursorIdByMsgBlockUserAtom = atom<string>({
  key: 'cursorIdByMsgBlockUserAtom',
  default: INIT_CURSOR_ID,
});

export const msgHiddenUserHashMapAtom = atom<Map<string, MsgBlockHiddenUser>>({
  key: 'msgHiddenUserHashMap',
  default: new Map(),
});

export const cursorIdByMsgHiddenUserAtom = atom<string>({
  key: 'cursorIdByMsgHiddenUserAtom',
  default: INIT_CURSOR_ID,
});

export const isSettingByMsgConversationAtom = atom<boolean>({
  key: 'isSettingByMsgConversation',
  default: false,
});

export const msgConversationScrollInfoAtom = atom<{
  currentPostion: number;
  maxScrollPosition: number;
  msgContainerHeight: number;
}>({
  key: 'msgConversationScrollInfo',
  default: {
    currentPostion: 0,
    maxScrollPosition: 0,
    msgContainerHeight: 0,
  },
});

export const sendedMsgListInfoAtom = atom<{
  unreadMsgNum: number;
  action: string;
}>({
  key: 'sendedMsgListInfo',
  default: {
    unreadMsgNum: 0,
    action: MESSAGE_NONE_ACTION,
  },
});
