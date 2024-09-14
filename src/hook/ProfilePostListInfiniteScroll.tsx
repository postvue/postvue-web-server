import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import PostTextContent from 'components/common/posts/body/PostTextContent';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_POST_LIST } from 'const/QueryClientConst';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import {
  getProfilePostListByCursor,
  GetProfilePostListRsp,
} from 'services/profile/getProfilePostList';
import styled from 'styled-components';

interface ProfilePostListInfiniteScrollProps {
  username: string;
}

export interface SearchPostQueryInterface {
  pages: GetProfilePostListRsp[];
  pageParams: unknown[];
}

const ProfilePostListInfiniteScroll: React.FC<
  ProfilePostListInfiniteScrollProps
> = ({ username }) => {
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useInfiniteQuery<
      GetProfilePostListRsp,
      AxiosError,
      SearchPostQueryInterface,
      [string]
    >({
      queryKey: [`${QUERY_STATE_PROFILE_POST_LIST}/${username}`], // query key
      queryFn: async ({ pageParam }) => {
        // pageParam이 string인지 확인

        if (typeof pageParam !== 'string') {
          // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
          return { cursorId: ZERO_CURSOR_ID, snsPostRspList: [] };
        }

        return getProfilePostListByCursor(username, pageParam);
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
    <ScrollBottomContainer>
      {data &&
        data.pages.flatMap((page) =>
          page.snsPostRspList.map((v, i) => (
            <ProfilePostContainer
              key={i}
              onClick={() => navigate(`/${v.username}/p/${v.postId}`)}
            >
              <ProfilePostImgListWrap>
                {v.postContents.map((value, i) => {
                  return (
                    <ProfilePostImgWrap key={i}>
                      <ProfilePostImg src={value.content} />
                    </ProfilePostImgWrap>
                  );
                })}
              </ProfilePostImgListWrap>
              {/* <PostReactionListElement
                postId={v.postId}
                postListRspAtom={profilePostHashMapAtom}
              /> */}
              <PostTextContent
                postContents={v.postContents}
                postedAt={v.postedAt}
                tags={v.tags}
              />
            </ProfilePostContainer>
          )),
        )}

      <div ref={ref}> 보인다.</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

const ProfilePostContainer = styled.div`
  cursor: pointer;
`;

const ProfilePostImgListWrap = styled.div``;

const ProfilePostImgWrap = styled.div`
  width: 100%;
  flex: 0 0 auto;
  cursor: pointer;
`;

const ProfilePostImg = styled.div<{ src: string }>`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3/3;
  background: url(${(props) => props.src}) center center / cover;
  border-radius: 8px;
`;

export default ProfilePostListInfiniteScroll;
