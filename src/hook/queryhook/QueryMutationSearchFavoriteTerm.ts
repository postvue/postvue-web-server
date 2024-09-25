import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import { QUERY_STATE_SEARCH_FAVORITE_TERM_LIST } from 'const/QueryClientConst';
import {
  GetFavoriteTermRsp,
  PutFavoriteSearchTermReq,
} from 'global/interface/search';
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
      const favoriteSearchTermList = queryClient.getQueryData<
        GetFavoriteTermRsp[]
      >([QUERY_STATE_SEARCH_FAVORITE_TERM_LIST]);

      if (!favoriteSearchTermList) return;

      const tempFavoriteSearchTermList = [...favoriteSearchTermList];

      if (data) {
        queryClient.setQueryData(
          [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
          [
            {
              favoriteTermName: variables.favoriteTerm,
              favoriteTermContent: variables.favoriteTermContent,
              favoriteTermContentType: variables.favoriteTermContentType,
            } as GetFavoriteTermRsp,
            ...tempFavoriteSearchTermList,
          ],
        );
      } else {
        tempFavoriteSearchTermList.filter(
          (value) => value.favoriteTermName !== variables.favoriteTerm,
        );

        queryClient.invalidateQueries({
          queryKey: [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
        });
      }
    },
  });
};
