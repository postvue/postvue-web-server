import { atom } from 'recoil';
import { RecommTagInfo } from '../global/interface/recomm';

export const recommTagListAtom = atom<RecommTagInfo[]>({
  key: 'recommTagList',
  default: [],
});
