import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_PROFILE_SCRAP } from 'const/QueryClientConst';

export async function refetchProfileScrap(scrapId: string): Promise<void> {
  await queryClient.refetchQueries({
    queryKey: [QUERY_STATE_PROFILE_SCRAP, scrapId],
    exact: true,
  });

  const updatedData = queryClient.getQueryData([
    QUERY_STATE_PROFILE_SCRAP,
    scrapId,
  ]);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_SCRAP, scrapId],
    data: updatedData,
  } as StateIMessage);
}
