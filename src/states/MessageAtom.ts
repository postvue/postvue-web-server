import { ProfileInfoByDirectMsg } from 'global/interface/profile';
import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import {
  MsgBlockHiddenUser,
  MsgConversation,
  MsgReactionInfo,
} from '../global/interface/message';

export const profileInfoByDirectMsgAtom = atom<ProfileInfoByDirectMsg>({
  key: 'profileInfoByDirectMsg',
  default: {
    targetUserId: '',
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

export const msgReactionInfoAtom = atom<MsgReactionInfo>({
  key: 'msgReactionInfo',
  default: {
    msgId: '',
    msgHeight: 0,
    y: 0,
    height: 0,
    isMyMsg: false,
    msgText: '',
  },
});
