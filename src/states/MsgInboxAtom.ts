import { atom } from 'recoil';
import { PAGE_NUM } from '../const/PageConfigConst';
import { MsgInboxMessage } from '../global/interface/message';

export const msgInboxMessageHashMapAtom = atom<Map<string, MsgInboxMessage>>({
  key: 'msgInboxMessageHashMap',
  default: new Map(),
});

export const pageNumAtomByMsgInboxMessage = atom<number>({
  key: 'pageNumByMsgInboxMessage',
  default: PAGE_NUM,
});
