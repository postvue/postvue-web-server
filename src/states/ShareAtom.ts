import { atom } from 'recoil';

export const isSharePopupAtom = atom<boolean>({
  key: 'isSharePopup',
  default: false,
});
