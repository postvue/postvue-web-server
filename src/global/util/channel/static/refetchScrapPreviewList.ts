import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_POST_SCRAP_PREVIEW_LIST } from 'const/QueryClientConst';

export async function refetchScrapPreviewList(postId: string): Promise<void> {
  await queryClient.refetchQueries({
    queryKey: [QUERY_STATE_POST_SCRAP_PREVIEW_LIST, postId],
  });

  const updatedData = queryClient.getQueryData([
    QUERY_STATE_POST_SCRAP_PREVIEW_LIST,
    postId,
  ]);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_POST_SCRAP_PREVIEW_LIST, postId],
    data: updatedData,
  } as StateIMessage);
}
