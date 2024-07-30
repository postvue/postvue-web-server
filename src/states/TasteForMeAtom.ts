import { atom } from 'recoil';
import { INIT_SCROLL_POSITION } from '../const/AttributeConst';
import { INIT_CURSOR_ID, PAGE_NUM } from '../const/PageConfigConst';
import { PostRsp } from '../global/interface/post';

export const tasteForMeListAtom = atom<PostRsp[]>({
  key: 'tasteForMeList',
  default: [],
});

export const cursorIdAtomByTasteForMe = atom<number>({
  key: 'cursorIdByTasteForMe',
  default: INIT_CURSOR_ID,
});

export const pageNumAtomByTasteForMe = atom<number>({
  key: 'pageNumByTasteForMe',
  default: PAGE_NUM,
});

export const scrollPositionAtomByasteForMe = atom<number>({
  key: 'scrollPositionByasteForMe',
  default: INIT_SCROLL_POSITION,
});
