import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_PROFILE_POST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { getPost } from 'services/post/getPost';

export async function fetchProfilePost(postId: string): Promise<PostRsp> {
  const postData = await getPost(postId);

  queryClient.setQueryData([QUERY_STATE_PROFILE_POST, postId], postData);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_POST, postId],
    data: postData,
  } as StateIMessage);

  return postData;
}
