import { NotificationMsgWsSub } from 'global/interface/notification';
import { getNotificationMsgHashMapByLocalStorage } from 'global/util/NotificationUtil';
import { atom } from 'recoil';

export const notificationMsgHashMapAtom = atom<
  Map<string, NotificationMsgWsSub>
>({
  key: 'notificationMsgHashMap',
  default: getNotificationMsgHashMapByLocalStorage(),
});
