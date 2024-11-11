import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { atom } from 'recoil';

export const isSharePopupAtom = atom<boolean>({
  key: 'isSharePopup',
  default: false,
});

export const shareUserSearchTempWordAtom = atom<string>({
  key: 'shareUserSearchTempWord',
  default: INIT_EMPTY_STRING_VALUE,
});

export const isShareUserSearchInputActiveAtom = atom<boolean>({
  key: 'isShareUserSearchInputActive',
  default: false,
});
