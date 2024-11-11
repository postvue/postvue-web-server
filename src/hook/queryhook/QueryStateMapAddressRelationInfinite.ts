import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_RECOMM_FAVORITTE_TAG_LIST } from 'const/QueryClientConst';
import { MapAddressRelation } from 'global/interface/map';
import { isValidString } from 'global/util/ValidUtil';
import { getMapAddressReplations } from 'services/maps/getMapAddressRelations';

export interface MapAddressRelationInfiniteInterface {
  pages: MapAddressRelation[][];
  pageParams: unknown[];
}

export const QueryStateMapAddressRelationInfinite = (
  srchQry: string,
  isActive = true,
): UseInfiniteQueryResult<
  MapAddressRelationInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    MapAddressRelation[],
    AxiosError,
    MapAddressRelationInfiniteInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_RECOMM_FAVORITTE_TAG_LIST + '_' + srchQry], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getMapAddressReplations(srchQry, pageParam);
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
