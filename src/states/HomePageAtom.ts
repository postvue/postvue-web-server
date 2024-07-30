import { atom } from 'recoil';
import { TASTE_FOR_ME_TAB_ID } from '../const/TabConfigConst';

export const homeTabIdAtom = atom<number>({
  key: 'homeTabId',
  default: TASTE_FOR_ME_TAB_ID,
});
