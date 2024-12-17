import { INIT_SCROLL_POSITION } from 'const/AttributeConst';
import { ViewPagerTabScrollInterface } from 'global/interface/pageInterface';
import { atom } from 'recoil';
import {
  FOLLOW_FOR_ME_TAB_ID,
  FOLLOW_FOR_ME_TAB_NAME,
  TASTE_FOR_ME_TAB_ID,
  TASTE_FOR_ME_TAB_NAME,
} from '../const/TabConfigConst';

export const homeTabIdAtom = atom<number>({
  key: 'homeTabId',
  default: TASTE_FOR_ME_TAB_ID,
});

export const homeScrollPositionInfoAtom = atom<ViewPagerTabScrollInterface[]>({
  key: 'scrollPositionByTasteForMe',
  default: [
    {
      tabId: TASTE_FOR_ME_TAB_ID,
      tabName: TASTE_FOR_ME_TAB_NAME,
      scroll: INIT_SCROLL_POSITION,
    },
    {
      tabId: FOLLOW_FOR_ME_TAB_ID,
      tabName: FOLLOW_FOR_ME_TAB_NAME,
      scroll: INIT_SCROLL_POSITION,
    },
  ],
});
