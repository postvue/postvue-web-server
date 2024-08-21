import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { MsgInboxMessage } from '../global/interface/message';

export const msgInboxMessageHashMapAtom = atom<Map<string, MsgInboxMessage>>({
  key: 'msgInboxMessageHashMap',
  default: new Map(),
});

export const cursorIdAtomByMsgInboxMessage = atom<string>({
  key: 'cursorIdByMsgInboxMessage',
  default: INIT_CURSOR_ID,
});

export const isFolloManagePopupByMsgInboxAtom = atom<boolean>({
  key: 'isFolloManagePopupByMsgInbox',
  default: false,
});
