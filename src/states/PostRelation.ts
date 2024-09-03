import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { PostRsp } from '../global/interface/post';

export const postRelationHashMapAtom = atom<Map<string, PostRsp>>({
  key: 'postRelationHashMap',
  default: new Map(),
});

export const cursorIdByPostRelationAtom = atom<string>({
  key: 'cursorIdByPostRelation',
  default: INIT_CURSOR_ID,
});
