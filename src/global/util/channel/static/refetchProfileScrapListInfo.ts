import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_PROFILE_SCRAP_INFO } from 'const/QueryClientConst';

export async function refetchProfileScrapInfo(): Promise<void> {
  await queryClient.invalidateQueries({
    queryKey: [QUERY_STATE_PROFILE_SCRAP_INFO],
  });

  const updatedData = await queryClient.getQueryData([
    QUERY_STATE_PROFILE_SCRAP_INFO,
  ]);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_SCRAP_INFO],
    data: updatedData,
  } as StateIMessage);
}
