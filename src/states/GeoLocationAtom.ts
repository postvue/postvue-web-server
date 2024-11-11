import { atom } from 'recoil';

export const isLocationSearchInputActiveAtom = atom<boolean>({
  key: 'isLocationSearchInputActive',
  default: false,
});

export const locationSearchQueryRelationHashMapAtom = atom<
  Map<string, string[]>
>({
  key: 'LocationSearchQueryRelationHashMap',
  default: new Map(),
});

export const locationSearchWordAtom = atom<string>({
  key: 'locationSearchTempWord',
  default: '',
});
