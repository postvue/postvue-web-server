import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_SEARCH_FAVORITE_TERM_LIST,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { GetFavoriteTermRsp } from 'global/interface/search';
import { getFavoriteSearchTerm } from 'services/search/getFavoriteSearchTermList';

export const QueryStateSearchFavoriteTermList = (): UseQueryResult<
  GetFavoriteTermRsp[],
  AxiosError<unknown, any>
> => {
  return useQuery<GetFavoriteTermRsp[], AxiosError>({
    queryKey: [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
    queryFn: () => getFavoriteSearchTerm(),
    staleTime: STALE_30_MINUTES_TIME,
  });
};
