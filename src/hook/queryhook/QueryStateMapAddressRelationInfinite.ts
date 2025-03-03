import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_MAP_ADDRES_RELATION_LIST } from 'const/QueryClientConst';
import { MapAddressRelation } from 'global/interface/map';
import { isValidString } from 'global/util/ValidUtil';
import { getMapAddressReplations } from 'services/maps/getMapAddressRelations';

export interface MapAddressRelationInfiniteInterface {
  pages: MapAddressRelation[][];
  pageParams: unknown[];
}

export const QueryStateMapAddressRelationInfinite = (
  srchQry: string,
  latitude?: number,
  longitude?: number,
  isActive = true,
): UseInfiniteQueryResult<
  MapAddressRelationInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    MapAddressRelation[],
    AxiosError,
    MapAddressRelationInfiniteInterface
  >({
    queryKey: [QUERY_STATE_MAP_ADDRES_RELATION_LIST, srchQry], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getMapAddressReplations(srchQry, pageParam, latitude, longitude);
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
