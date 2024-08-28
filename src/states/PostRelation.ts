import { atom } from 'recoil';
import { PostRsp } from '../global/interface/post';

export const postRelationHashMapAtom = atom<Map<string, PostRsp>>({
  key: 'postRelationHashMap',
  default: new Map(),
});
