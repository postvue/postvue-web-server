import { queryClient } from 'App';
import { INIT_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_ACCOUNT_POST_LIST } from 'const/QueryClientConst';
import { ProfilePostListQueryInterface } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { getProfilePostListByCursor } from 'services/profile/getProfilePostList';

export async function fetchProfilePostListByNotChannel(
  username: string,
): Promise<ProfilePostListQueryInterface> {
  const fetchData = await getProfilePostListByCursor(username, INIT_CURSOR_ID);

  const data: ProfilePostListQueryInterface = {
    pageParams: [INIT_CURSOR_ID],
    pages: [{ ...fetchData }],
  };

  queryClient.setQueryData(
    [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST, username],
    data,
  );

  return data;
}
