import { atom } from 'recoil';
import { PostRsp } from '../global/interface/post';

export const systemPostRspHashMapAtom = atom<Map<string, PostRsp>>({
  key: 'systemPostRspHashMap',
  default: new Map(),
});

export const isLoadingPopupAtom = atom<boolean>({
  key: 'isLoadingPopup',
  default: false,
});
