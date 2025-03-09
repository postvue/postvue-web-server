import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_PROFILE_SCRAP_LIST } from 'const/QueryClientConst';

export async function refetchProfileScrapList(): Promise<void> {
  await queryClient.refetchQueries({
    queryKey: [QUERY_STATE_PROFILE_SCRAP_LIST],
    exact: true,
  });

  const updatedData = queryClient.getQueryData([
    QUERY_STATE_PROFILE_SCRAP_LIST,
  ]);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_SCRAP_LIST],
    data: updatedData,
  } as StateIMessage);
}
