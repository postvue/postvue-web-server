import { atom } from 'recoil';

export const masonryColumnCountAtom = atom<number>({
  key: 'masonryColumnCount',
  default: 1,
});

export const masonryUpdateCountAtom = atom<number>({
  key: 'masonryUpdateCount',
  default: 0,
});
