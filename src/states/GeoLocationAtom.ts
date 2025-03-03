import { atom } from 'recoil';

export const isLocationSearchInputActiveAtom = atom<boolean>({
  key: 'isLocationSearchInputActive',
  default: false,
});

export const locationSearchWordAtom = atom<string>({
  key: 'locationSearchTempWord',
  default: '',
});

export const currentGisInfoAtom = atom<{
  latitude?: number;
  longitude?: number;
}>({
  key: 'currentGisInfo',
  default: {
    latitude: undefined,
    longitude: undefined,
  },
});
