import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import MasonryLayout from 'components/layouts/MasonryLayout';
import { PAGE_NUM } from 'const/PageConfigConst';
import {
  SEARCH_POST_LASTEST_QUERY_PARAM,
  SEARCH_POST_MY_NEAR_QUERY_PARAM,
} from 'const/TabConfigConst';
import { MasonryPostRsp } from 'global/interface/post';
import { GetSearchPostsRsp } from 'global/interface/search';
import {
  decodeSearhWordAndFilterKey,
  isValidSearchWordAndFilterKey,
} from 'global/util/SearchPostUtil';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { getPostSearchNear } from 'services/post/getPostSearchNear';
import { getPostSearchPopular } from 'services/post/getPostSearchPopular';
import styled from 'styled-components';
import { getPostSearchLive } from '../services/post/getPostSearchLive';

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

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useInfiniteQuery<
      GetSearchPostsRsp,
      AxiosError,
      SearchPostQueryInterface,
      [string]
    >({
      queryKey: [searchQueryAndFilterKey], // query key
      queryFn: async ({ pageParam }) => {
        // pageParam이 string인지 확인

        if (
          typeof pageParam !== 'number' ||
          !isValidString(searchQueryAndFilterKey) ||
          !isValidSearchWordAndFilterKey(searchQueryAndFilterKey)
        ) {
          // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
          return {
            snsPostRspList: [],
            isBookMarkedFavoriteTerm: false,
            isFetchFavoriteState: false,
          };
        }

        // pageParam이 string인 경우 API 호출을 수행합니다.

        const [searchWord, filterQueryPram] = decodeSearhWordAndFilterKey(
          searchQueryAndFilterKey,
        );

        if (filterQueryPram === SEARCH_POST_LASTEST_QUERY_PARAM) {
          return getPostSearchLive(searchWord, pageParam);
        } else if (filterQueryPram === SEARCH_POST_MY_NEAR_QUERY_PARAM) {
          return getPostSearchNear(searchWord, pageParam);
        } else {
          return getPostSearchPopular(searchWord, pageParam);
        }
      },

      getNextPageParam: (lastPage, allPages) => {
        // Increment pageParam by 1 for the next page

        return lastPage.snsPostRspList.length > 0 ? allPages.length : undefined;
      },

      initialPageParam: PAGE_NUM,

      enabled: !!searchQueryAndFilterKey,

      select: (data) => {
        return {
          pages: [...data.pages].reverse(),
          pageParams: [...data.pageParams].reverse(),
        };
      },
    });

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
    <ScrollBottomContainer>
      {data && (
        <MasonryLayout
          snsPostUrlList={data.pages.flatMap((page) =>
            page.snsPostRspList.map((v) => {
              const postContent = v.postContents[0];
              // let imageContent = v.postContents.find(
              //   (postContent) =>
              //     postContent.postContentType !== POST_TEXTFIELD_TYPE,
              // )?.content;
              // imageContent = imageContent ? imageContent : NO_IMAGE_DATA_LINK;

              const homePostRsp: MasonryPostRsp = {
                postId: v.postId,
                userId: v.userId,
                postContent: postContent.content,
                postContentType: postContent.postContentType,
                username: v.username,
                location: v.location,
              };

              return homePostRsp;
            }),
          )}
        />
      )}

      <div ref={ref}> 보인다.</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default SearchPostListInfiniteScroll;
