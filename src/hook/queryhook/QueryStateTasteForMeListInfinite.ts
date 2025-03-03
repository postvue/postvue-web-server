import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  INIT_CURSOR_ID,
  PAGE_NUM,
  ZERO_CURSOR_ID,
} from 'const/PageConfigConst';
import { QUERY_STATE_TASTE_FOR_ME_LIST } from 'const/QueryClientConst';
import { GetTasteForMeListRsp } from 'services/post/home/getFollowForMeList';
import { getTasteForMeListByParam } from 'services/post/home/getTasteForMeList';

export interface TasteForMeParamType {
  cursorId: string;
  pageNum: number;
}

export interface TasteForMeListQueryInterface {
  pages: GetTasteForMeListRsp[];
  pageParams: TasteForMeParamType[];
}

export const QueryStateTasteForMeListInfinite = (): UseInfiniteQueryResult<
  TasteForMeListQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetTasteForMeListRsp,
    AxiosError,
    TasteForMeListQueryInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_TASTE_FOR_ME_LIST], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      const tasteForMeParam = pageParam as TasteForMeParamType;

      return getTasteForMeListByParam(
        tasteForMeParam.cursorId,
        tasteForMeParam.pageNum,
      );
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page

      return lastPage.cursorId === ZERO_CURSOR_ID &&
        lastPage.snsPostRspList.length <= 0
        ? undefined
        : { cursorId: lastPage.cursorId, pageNum: allPages.length };
    },

    initialPageParam: {
      cursorId: INIT_CURSOR_ID,
      pageNum: PAGE_NUM,
    } as TasteForMeParamType,
    retry: false,
  });
};
