import { queryClient } from 'App';

export const INVALIDATE_QUERIES = 'INVALIDATE_QUERIES';
export const REFETCH_QUERIES = 'REFETCH_QUERIES';
export const SEND_DATA_QUERIES = 'SEND_DATA_QUERIES';

// 타입을 as const로 정확히 추출
export const QUERY_MESSAGE_TYPES = {
  INVALIDATE_QUERIES,
  REFETCH_QUERIES,
  SEND_DATA_QUERIES,
} as const;

// 타입 추출
type QueryMessageType = keyof typeof QUERY_MESSAGE_TYPES;

export interface StateIMessage {
  type: QueryMessageType;
  queryKey: string[];
  data: any;
}

console.log('boad cast channel setting');
const stateChannel = new BroadcastChannel('query-sync-channel');

stateChannel.onmessage = (ev: MessageEvent) => {
  const message = ev.data as StateIMessage; // Cast the event data to IMessage

  if (message.type === QUERY_MESSAGE_TYPES.INVALIDATE_QUERIES) {
    queryClient.invalidateQueries({ queryKey: message.queryKey });
    console.log('호잉스', message.queryKey);

    return;
  }

  if (message.type === QUERY_MESSAGE_TYPES.REFETCH_QUERIES) {
    queryClient.refetchQueries({
      queryKey: message.queryKey,
    });
    console.log('호잉');

    return;
  }

  if (message.type === QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES) {
    console.log(QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES);
    console.log(message.queryKey);
    console.log(message.data);
    queryClient.setQueryData(message.queryKey, message.data);

    return;
  }
};

export { stateChannel };
