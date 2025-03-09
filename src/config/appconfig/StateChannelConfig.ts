import { queryClient } from 'App';
import { notify } from 'components/popups/ToastMsgPopup';

export const INVALIDATE_QUERIES = 'INVALIDATE_QUERIES';
export const REFETCH_QUERIES = 'REFETCH_QUERIES';
export const SEND_DATA_QUERIES = 'SEND_DATA_QUERIES';
export const TOAST_MSG = 'TOAST_MSG';

// 타입을 as const로 정확히 추출
export const QUERY_MESSAGE_TYPES = {
  INVALIDATE_QUERIES,
  REFETCH_QUERIES,
  SEND_DATA_QUERIES,
  TOAST_MSG,
} as const;

// 타입 추출
type QueryMessageType = keyof typeof QUERY_MESSAGE_TYPES;

export interface StateIMessage {
  type: QueryMessageType;
  queryKey: string[];
  data: any;
  isToast: boolean | undefined;
  toastMsg: string | undefined;
}

console.log('boad cast channel setting');
const stateChannel = new BroadcastChannel('query-sync-channel');

stateChannel.onmessage = (ev: MessageEvent) => {
  const message = ev.data as StateIMessage; // Cast the event data to IMessage

  if (message.type === QUERY_MESSAGE_TYPES.INVALIDATE_QUERIES) {
    queryClient.invalidateQueries({ queryKey: message.queryKey });

    return;
  }

  if (message.type === QUERY_MESSAGE_TYPES.REFETCH_QUERIES) {
    queryClient.refetchQueries({
      queryKey: message.queryKey,
    });

    return;
  }

  if (message.type === QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES) {
    queryClient.setQueryData(message.queryKey, message.data);

    if (message.isToast && message.toastMsg) {
      notify({ msgTitle: message.toastMsg });
    }

    return;
  }

  if (message.type === QUERY_MESSAGE_TYPES.TOAST_MSG) {
    return;
  }
};

export { stateChannel };
