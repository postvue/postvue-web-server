import { atom } from 'recoil';

export const isLocationSearchInputActiveAtom = atom<boolean>({
  key: 'isLocationSearchInputActive',
  default: false,
});

export const locationSearchWordAtom = atom<string>({
  key: 'locationSearchTempWord',
  default: '',
});
