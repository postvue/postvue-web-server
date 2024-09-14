import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_POST_SCRAP_PREVIEW_LIST,
  SERACH_FAVORITE_TERMS_STALE_TIME,
} from 'const/QueryClientConst';
import { GetMyProfileScrapPreviewsRsp } from 'global/interface/profile';
import { getMyProfileScrapPreviews } from 'services/profile/getMyProfileScrapPreview';

export const QueryStatePostScrapPreviewList = (
  postId: string,
  active: boolean,
): UseQueryResult<GetMyProfileScrapPreviewsRsp[], AxiosError<unknown, any>> => {
  return useQuery<GetMyProfileScrapPreviewsRsp[], AxiosError>({
    queryKey: [QUERY_STATE_POST_SCRAP_PREVIEW_LIST, postId],
    queryFn: () => getMyProfileScrapPreviews(postId),
    staleTime: SERACH_FAVORITE_TERMS_STALE_TIME,
    enabled: active,
  });
};
