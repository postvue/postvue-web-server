import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { atom } from 'recoil';

// export const isSharePopupAtom = atom<boolean>({
//   key: 'isSharePopup',
//   default: false,
// });

export const sharePopupInfoAtom = atom<{
  isActive: boolean;
  shareLink: string;
  mainImageUrl: string;
  isFixed: boolean;
}>({
  key: 'isSharePopup',
  default: {
    isActive: false,
    shareLink: '',
    mainImageUrl: '',
    isFixed: false,
  },
});

export const shareUserSearchWordAtom = atom<string>({
  key: 'shareUserSearcWord',
  default: INIT_EMPTY_STRING_VALUE,
});

export const isLoadingSearchSharePoupupAtom = atom<boolean>({
  key: 'isLoadingSearchSharePoupup',
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
