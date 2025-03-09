import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_SEARCH_FAVORITE_TERM_LIST } from 'const/QueryClientConst';
import {
  GetFavoriteTermRsp,
  PutFavoriteSearchTermReq,
} from 'global/interface/search';
import { SearchFavoriteTermListInterface } from 'hook/queryhook/QueryStateSearchFavoriteTermListInfinite';
import { getFavoriteSearchTermList } from 'services/search/getFavoriteSearchTermList';

export async function setQueryOrFetchSearchFavoriteListIntifinite(
  isFavorite: boolean,
  favoriteSearchTermReq: PutFavoriteSearchTermReq,
): Promise<void> {
  const favoriteSearchTermList: SearchFavoriteTermListInterface | undefined =
    queryClient.getQueryData([QUERY_STATE_SEARCH_FAVORITE_TERM_LIST]);

  let data: SearchFavoriteTermListInterface;
  if (favoriteSearchTermList) {
    const tempFavoriteSearchTermList = { ...favoriteSearchTermList };

    if (isFavorite) {
      tempFavoriteSearchTermList.pages[0] = [
        {
          favoriteTermName: favoriteSearchTermReq.favoriteTerm,
          favoriteTermContent: favoriteSearchTermReq.favoriteTermContent,
          favoriteTermContentType:
            favoriteSearchTermReq.favoriteTermContentType,
        } as GetFavoriteTermRsp,
        ...tempFavoriteSearchTermList.pages[0],
      ];

      data = tempFavoriteSearchTermList;
      queryClient.setQueryData(
        [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
        tempFavoriteSearchTermList,
      );
    } else {
      tempFavoriteSearchTermList.pages = tempFavoriteSearchTermList.pages.map(
        (page) => {
          // 삭제할 댓글을 제외한 새로운 리스트를 반환
          const updatedSearchTermList = page.filter(
            (value) =>
              value.favoriteTermName !== favoriteSearchTermReq.favoriteTerm,
          );

          const date: GetFavoriteTermRsp[] = [...updatedSearchTermList];

          return date;
        },
      );
      data = tempFavoriteSearchTermList;

      queryClient.setQueryData(
        [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
        tempFavoriteSearchTermList,
      );
    }
  } else {
    const searchTermList = await getFavoriteSearchTermList(PAGE_NUM);
    data = {
      pages: [searchTermList],
      pageParams: [PAGE_NUM],
    };
  }

  await queryClient.setQueryData([QUERY_STATE_SEARCH_FAVORITE_TERM_LIST], data);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
    data: data,
  } as StateIMessage);
}
