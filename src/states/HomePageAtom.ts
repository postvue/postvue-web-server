import { atom } from 'recoil';
import { TASTE_FOR_ME_TAB_ID } from '../const/TabConfigConst';

export const homeTabInfoAtom = atom<{
  activeTabId: number;
  scrollInfo: { isActive: boolean; scroll: number };
}>({
  key: 'homeTabInfo',
  default: {
    activeTabId: TASTE_FOR_ME_TAB_ID,
    scrollInfo: {
      isActive: false,
      scroll: 0,
    },
  },
});
