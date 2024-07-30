import { atom } from 'recoil';
import { INIT_SCROLL_POSITION } from '../const/AttributeConst';
import { INIT_CURSOR_ID, PAGE_NUM } from '../const/PageConfigConst';
import { PostRsp } from '../global/interface/post';

export const followForMeListAtom = atom<PostRsp[]>({
  key: 'followForMeList',
  default: [],
});

export const cursorIdAtomByFollowForMe = atom<number>({
  key: 'cursorIdByFollowForMe',
  default: INIT_CURSOR_ID,
});

export const pageNumAtomByFollowForMe = atom<number>({
  key: 'pageNumByFollowForMe',
  default: PAGE_NUM,
});

export const scrollPositionAtomByFollowForMe = atom<number>({
  key: 'scrollPositionByFollowForMe',
  default: INIT_SCROLL_POSITION,
});
