import { atom } from 'recoil';
import { INIT_CURSOR_ID, PAGE_NUM } from '../const/PageConfigConst';
import { PostRsp } from '../global/interface/post';

// export const followForMeListAtom = atom<PostRsp[]>({
//   key: 'followForMeList',
//   default: [],
// });

export const followForMeHashMapAtom = atom<Map<string, PostRsp>>({
  key: 'followForMeHashMap',
  default: new Map(),
});

export const cursorIdAtomByFollowForMe = atom<string>({
  key: 'cursorIdByFollowForMe',
  default: INIT_CURSOR_ID,
});

export const pageNumAtomByFollowForMe = atom<number>({
  key: 'pageNumByFollowForMe',
  default: PAGE_NUM,
});
