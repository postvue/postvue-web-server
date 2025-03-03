import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_SEARCH_FAVORITE_TERM_LIST,
  QUERY_STATE_SEARCH_TERM_INFO,
} from 'const/QueryClientConst';
import { PutFavoriteSearchTermReq } from 'global/interface/search';
import { setQueryOrFetchSearchFavoriteListIntifinite } from 'global/util/channel/static/setQueryOrFetchSearchFavoriteListIntifinite';

import { setQueryOrFetchSearchFavoritePreviewList } from 'global/util/channel/static/setQueryOrFetchSearchFavoritePreviewList';
import { putFavoriteSearchTerm } from 'services/search/putFavoriteSearchTerm';

export const QueryMutationSearchFavoriteTermList = (): UseMutationResult<
  boolean,
  AxiosError,
  PutFavoriteSearchTermReq
> => {
  return useMutation({
    mutationKey: [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
    mutationFn: (putFavoriteSearchTermReq: PutFavoriteSearchTermReq) =>
      putFavoriteSearchTerm(putFavoriteSearchTermReq),
    onSuccess(data, variables) {
      setQueryOrFetchSearchFavoriteListIntifinite(data, variables);
      setQueryOrFetchSearchFavoritePreviewList(data, variables);
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_SEARCH_TERM_INFO, variables.favoriteTerm],
      });
    },
  });
};
