import { atom } from 'recoil';

export const isTagSearchPopupAtom = atom<boolean>({
  key: 'isTagSearchPopup',
  default: false,
});

export const tagSearchInputAtom = atom<string>({
  key: 'tagSearchInput',
  default: '',
});

export const tagSearchQueryHashMapAtom = atom<Map<string, string[]>>({
  key: 'tagSearchQueryHashMap',
  default: new Map(),
});
