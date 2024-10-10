import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import MasonryLayout from 'components/layouts/MasonryLayout';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_POST_RELATION_LIST } from 'const/QueryClientConst';
import { MasonryPostRsp } from 'global/interface/post';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  getRecommPostRelation,
  GetRecommPostRelationRsp,
} from 'services/recomm/getRecommPostRelation';
import styled from 'styled-components';

interface ProfilePostListInfiniteScrollProps {
  postId: string;
}

export interface ProfilePostRelationQueryInterface {
  pages: GetRecommPostRelationRsp[];
  pageParams: unknown[];
}

const PostRelationListInfiniteScroll: React.FC<
  ProfilePostListInfiniteScrollProps
> = ({ postId }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useInfiniteQuery<
      GetRecommPostRelationRsp,
      AxiosError,
      ProfilePostRelationQueryInterface,
      [string]
    >({
      queryKey: [`${QUERY_STATE_POST_RELATION_LIST}/${postId}`], // query key
      queryFn: async ({ pageParam }) => {
        // pageParam이 string인지 확인

        if (typeof pageParam !== 'string') {
          // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
          return { cursorId: ZERO_CURSOR_ID, snsPostRspList: [] };
        }

        return getRecommPostRelation(postId, pageParam);
      },

      getNextPageParam: (lastPage) => {
        // Increment pageParam by 1 for the next page

        return lastPage.cursorId !== ZERO_CURSOR_ID
          ? lastPage.cursorId
          : undefined;
      },

      initialPageParam: INIT_CURSOR_ID,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <PostRelationWrap>
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
    </PostRelationWrap>
  );
};

const PostRelationWrap = styled.div`
  padding: 15px 11px 0 11px;
`;

export default PostRelationListInfiniteScroll;
