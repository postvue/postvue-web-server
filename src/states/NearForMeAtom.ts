import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { PostRsp } from '../global/interface/post';

export const nearForMeListAtom = atom<PostRsp[]>({
  key: 'mainProductListByHome',
  default: [],
});

export const curosrNumAtom = atom<string>({
  key: 'pageNumByMainPage',
  default: INIT_CURSOR_ID,
});
