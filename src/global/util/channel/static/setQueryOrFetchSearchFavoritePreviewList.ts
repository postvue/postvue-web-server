import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_SEARCH_FAVORITE_PREVIEW_TERM_LIST } from 'const/QueryClientConst';
import {
  GetFavoriteTermRsp,
  PutFavoriteSearchTermReq,
} from 'global/interface/search';
import { getFavoriteSearchTermPreviewList } from 'services/search/getFavoriteSearchTermPreviewList';

export async function setQueryOrFetchSearchFavoritePreviewList(
  isFavorite: boolean,
  favoriteSearchTermReq: PutFavoriteSearchTermReq,
): Promise<void> {
  const favoriteSearchTermList = queryClient.getQueryData<GetFavoriteTermRsp[]>(
    [QUERY_STATE_SEARCH_FAVORITE_PREVIEW_TERM_LIST],
  );

  let data: GetFavoriteTermRsp[];
  if (favoriteSearchTermList) {
    const tempFavoriteSearchTermList = [...favoriteSearchTermList];

    if (isFavorite) {
      data = [
        {
          favoriteTermName: favoriteSearchTermReq.favoriteTerm,
          favoriteTermContent: favoriteSearchTermReq.favoriteTermContent,
          favoriteTermContentType:
            favoriteSearchTermReq.favoriteTermContentType,
        } as GetFavoriteTermRsp,
        ...tempFavoriteSearchTermList,
      ];
      queryClient.setQueryData(
        [QUERY_STATE_SEARCH_FAVORITE_PREVIEW_TERM_LIST],
        [
          {
            favoriteTermName: favoriteSearchTermReq.favoriteTerm,
            favoriteTermContent: favoriteSearchTermReq.favoriteTermContent,
            favoriteTermContentType:
              favoriteSearchTermReq.favoriteTermContentType,
          } as GetFavoriteTermRsp,
          ...tempFavoriteSearchTermList,
        ],
      );
    } else {
      data = tempFavoriteSearchTermList.filter(
        (value) =>
          value.favoriteTermName !== favoriteSearchTermReq.favoriteTerm,
      );

      queryClient.setQueryData(
        [QUERY_STATE_SEARCH_FAVORITE_PREVIEW_TERM_LIST],
        tempFavoriteSearchTermList,
      );
    }
  } else {
    data = await getFavoriteSearchTermPreviewList();
  }

  await queryClient.setQueryData(
    [QUERY_STATE_SEARCH_FAVORITE_PREVIEW_TERM_LIST],
    data,
  );

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_SEARCH_FAVORITE_PREVIEW_TERM_LIST],
    data: data,
  } as StateIMessage);
}
