import { atom } from 'recoil';
import { SessionActiveUserInfoSub } from '../global/interface/session';

export const sessionActiveUserInfoHashMapAtom = atom<
  Map<string, SessionActiveUserInfoSub>
>({
  key: 'sessionActiveUserInfoHashMap',
  default: new Map(),
});
