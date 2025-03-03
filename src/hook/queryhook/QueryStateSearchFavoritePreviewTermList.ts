import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_SEARCH_FAVORITE_PREVIEW_TERM_LIST,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { GetFavoriteTermRsp } from 'global/interface/search';
import { getFavoriteSearchTermPreviewList } from 'services/search/getFavoriteSearchTermPreviewList';

export const QueryStateSearchFavoriteTermPreviewList = (
  isAcitve = true,
): UseQueryResult<GetFavoriteTermRsp[], AxiosError<unknown, any>> => {
  return useQuery<GetFavoriteTermRsp[], AxiosError>({
    queryKey: [QUERY_STATE_SEARCH_FAVORITE_PREVIEW_TERM_LIST],
    queryFn: () => getFavoriteSearchTermPreviewList(),
    staleTime: STALE_30_MINUTES_TIME,
    enabled: isAcitve,
  });
};
