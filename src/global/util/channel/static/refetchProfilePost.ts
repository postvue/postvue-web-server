import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_PROFILE_POST } from 'const/QueryClientConst';

export async function refetchProfilePost(postId: string): Promise<void> {
  await queryClient.refetchQueries({
    queryKey: [QUERY_STATE_PROFILE_POST, postId],
  });

  const updatedPostData = queryClient.getQueryData([
    QUERY_STATE_PROFILE_POST,
    postId,
  ]);
  console.log('바뀌는 구나', updatedPostData);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_POST, postId],
    data: updatedPostData,
  } as StateIMessage);
}
