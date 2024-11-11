import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_MAP_POST_SEARCH_LIST } from 'const/QueryClientConst';
import { MapPostSrchRsp } from 'global/interface/map';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { getMapPostSearchList } from 'services/maps/getMapPostSearchList';

export interface MapPostSearchRelationInfiniteInterface {
  pages: MapPostSrchRsp[][];
  pageParams: unknown[];
}

export const QueryStateMapPostSearchRelationInfinite = (
  srchQry: string,
  isActive = true,
): UseInfiniteQueryResult<
  MapPostSearchRelationInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    MapPostSrchRsp[],
    AxiosError,
    MapPostSearchRelationInfiniteInterface,
    [string]
  >({
    queryKey: [convertQueryTemplate(QUERY_STATE_MAP_POST_SEARCH_LIST, srchQry)], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getMapPostSearchList(srchQry, pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page

      return lastPage.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,
    enabled: isValidString(srchQry) && isActive,
    retry: false,
  });
};
