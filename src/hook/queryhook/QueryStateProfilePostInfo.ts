import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_PROFILE_POST_INFO,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { PostInfoRsp } from 'global/interface/post';
import { isValidString } from 'global/util/ValidUtil';
import { getPostInfo } from 'services/post/getPostInfo';

export const QueryStatePostInfo = (
  postId: string,
): UseQueryResult<PostInfoRsp, AxiosError<unknown, any>> => {
  return useQuery<PostInfoRsp, AxiosError>({
    queryKey: [QUERY_STATE_PROFILE_POST_INFO, postId],
    queryFn: () => getPostInfo(postId),
    staleTime: STALE_30_MINUTES_TIME,
    enabled: isValidString(postId),
    refetchOnMount: 'always',
    retry: false,
  });
};
