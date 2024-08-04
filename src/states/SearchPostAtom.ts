import { atom } from 'recoil';
import { INIT_EMPTY_STRING_VALUE } from '../const/AttributeConst';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { PostRsp } from '../global/interface/post';

export const searchPostHashMapAtom = atom<Map<string, PostRsp>>({
  key: 'searchPostHashMap',
  default: new Map(),
});

export const cursorIdAtomBySearchPost = atom<string>({
  key: 'cursorIdBySearchPost',
  default: INIT_CURSOR_ID,
});

export const searchWordAtom = atom<string>({
  key: 'seearchWord',
  default: INIT_EMPTY_STRING_VALUE,
});
