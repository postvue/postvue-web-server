import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_PROFILE_POST,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { isValidString } from 'global/util/ValidUtil';
import { getPost } from 'services/post/getPost';

export const QueryStateProfilePost = (
  postId: string,
  isActive = false,
): UseQueryResult<PostRsp, AxiosError<unknown, any>> => {
  return useQuery<PostRsp, AxiosError>({
    queryKey: [QUERY_STATE_PROFILE_POST, postId],
    queryFn: () => getPost(postId),
    staleTime: STALE_30_MINUTES_TIME,
    enabled: isValidString(postId) && isActive,
    retry: false,
  });
};
