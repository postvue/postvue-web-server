import InViewComponent from 'components/common/container/InViewComponent';
import { GetSearchPostsRsp } from 'global/interface/search';
import { isValidSearchWordAndFilterKey } from 'global/util/SearchPostUtil';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStatePostSearchListInfinite } from './queryhook/QueryStatePostSearchListInfinite';

interface RepostInfiniteScrollProps {
  searchQueryAndFilterKey: string;
}

export interface SearchPostQueryInterface {
  pages: GetSearchPostsRsp[];
  pageParams: unknown[];
}

const SearchPostListInfiniteScroll: React.FC<RepostInfiniteScrollProps> = ({
  searchQueryAndFilterKey,
}) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStatePostSearchListInfinite(searchQueryAndFilterKey);
  // useInfiniteQuery<
  //   GetSearchPostsRsp,
  //   AxiosError,
  //   SearchPostQueryInterface,
  //   [string]
  // >({
  //   queryKey: [
  //     convertQueryTemplate(
  //       QUERY_STATE_SEARCH_POST_LIST,
  //       searchQueryAndFilterKey,
  //     ),
  //   ], // query key
  //   queryFn: async ({ pageParam }) => {
  //     // pageParam이 string인지 확인

  //     if (
  //       typeof pageParam !== 'number' ||
  //       !isValidString(searchQueryAndFilterKey) ||
  //       !isValidSearchWordAndFilterKey(searchQueryAndFilterKey)
  //     ) {
  //       // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
  //       return {
  //         snsPostRspList: [],
  //         isBookMarkedFavoriteTerm: false,
  //         isFetchFavoriteState: false,
  //       };
  //     }

  //     // pageParam이 string인 경우 API 호출을 수행합니다.

  //     const [searchWord, filterQueryPram] = decodeSearhWordAndFilterKey(
  //       searchQueryAndFilterKey,
  //     );

  //     if (filterQueryPram === SEARCH_POST_LASTEST_QUERY_PARAM) {
  //       return getPostSearchLive(searchWord, pageParam);
  //     } else if (filterQueryPram === SEARCH_POST_MY_NEAR_QUERY_PARAM) {
  //       return getPostSearchNear(searchWord, pageParam);
  //     } else {
  //       return getPostSearchPopular(searchWord, pageParam);
  //     }
  //   },

  //   getNextPageParam: (lastPage, allPages) => {
  //     // Increment pageParam by 1 for the next page

  //     return lastPage.snsPostRspList.length > 0 ? allPages.length : undefined;
  //   },

  //   initialPageParam: PAGE_NUM,

  //   enabled: !!searchQueryAndFilterKey,

  //   select: (data) => {
  //     return {
  //       pages: [...data.pages].reverse(),
  //       pageParams: [...data.pageParams].reverse(),
  //     };
  //   },
  // });

  useEffect(() => {
    if (
      isValidSearchWordAndFilterKey(searchQueryAndFilterKey) &&
      inView &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default SearchPostListInfiniteScroll;
