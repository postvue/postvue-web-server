import { queryClient } from 'App';
import { QUERY_STATE_PROFILE_FOLLOWER_LIST } from 'const/QueryClientConst';

export const onClickFollowGlobalState = (username: string): void => {
  queryClient.invalidateQueries({
    queryKey: [QUERY_STATE_PROFILE_FOLLOWER_LIST, username],
  });
  queryClient.invalidateQueries({
    queryKey: [QUERY_STATE_PROFILE_FOLLOWER_LIST, username],
  });
};
