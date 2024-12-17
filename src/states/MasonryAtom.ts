import { atom } from 'recoil';

export const masonryColumnCountAtom = atom<number>({
  key: 'masonryColumnCount',
  default: 1,
});
