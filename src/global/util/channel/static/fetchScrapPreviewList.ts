import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_POST_SCRAP_PREVIEW_LIST } from 'const/QueryClientConst';
import { getMyProfileScrapPreviews } from 'services/profile/getMyProfileScrapPreview';

export async function fetchScrapPreviewList(postId: string): Promise<void> {
  const postPreviewScrapList = await getMyProfileScrapPreviews(postId);

  queryClient.setQueryData(
    [QUERY_STATE_POST_SCRAP_PREVIEW_LIST, postId],
    postPreviewScrapList,
  );

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_POST_SCRAP_PREVIEW_LIST, postId],
    data: postPreviewScrapList,
  } as StateIMessage);
}
