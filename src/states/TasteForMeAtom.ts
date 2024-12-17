import { atom } from 'recoil';
import { INIT_CURSOR_ID, PAGE_NUM } from '../const/PageConfigConst';
import { PostRsp } from '../global/interface/post';

// export const tasteForMeListAtom = atom<PostRsp[]>({
//   key: 'tasteForMeList',
//   default: [],
// });

export const tasteForMeHashMapAtom = atom<Map<string, PostRsp>>({
  key: 'tasteForMeHashMap',
  default: new Map(),
});

export const cursorIdAtomByTasteForMe = atom<string>({
  key: 'cursorIdByTasteForMe',
  default: INIT_CURSOR_ID,
});

export const pageNumAtomByTasteForMe = atom<number>({
  key: 'pageNumByTasteForMe',
  default: PAGE_NUM,
});
