import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { INIT_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_ACCOUNT_POST_LIST } from 'const/QueryClientConst';
import { ProfilePostListQueryInterface } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { getProfilePostListByCursor } from 'services/profile/getProfilePostList';

export async function fetchProfileAccountListInfinite(
  username: string,
): Promise<void> {
  const profileAccountPostList = await getProfilePostListByCursor(
    username,
    INIT_CURSOR_ID,
  );

  const fetchData: ProfilePostListQueryInterface = {
    pageParams: [INIT_CURSOR_ID],
    pages: [profileAccountPostList],
  };

  queryClient.setQueryData(
    [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST, username],
    fetchData,
  );

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST, username],
    data: fetchData,
  } as StateIMessage);
}
