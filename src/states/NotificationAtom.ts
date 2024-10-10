import { NotificationMsgWsSub } from 'global/interface/notification';
import { atom } from 'recoil';

export const notificationMsgHashMapAtom = atom<
  Map<string, NotificationMsgWsSub>
>({
  key: 'notificationMsgHashMap',
  default: new Map(),
});
