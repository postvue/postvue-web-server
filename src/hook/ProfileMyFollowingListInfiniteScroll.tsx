import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { PROFILE_LIST_PATH } from 'const/PathConst';
import { QUERY_STATE_MY_PROFILE_FOLLOWING_LIST } from 'const/QueryClientConst';
import { PostProfileInfoRsp } from 'global/interface/post';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { getMyProfileFollowingList } from 'services/profile/getMyProfileFollowingList';
import styled from 'styled-components';

const ProfileMyFollowingListInfiniteScroll: React.FC = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useInfiniteQuery<PostProfileInfoRsp[], AxiosError>({
      queryKey: [QUERY_STATE_MY_PROFILE_FOLLOWING_LIST], // query key
      queryFn: async ({ pageParam }) => {
        // pageParam이 string인지 확인

        if (typeof pageParam !== 'number') {
          // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
          return [];
        }

        return getMyProfileFollowingList(pageParam);
      },

      getNextPageParam: (lastPage, allPages) => {
        // Increment pageParam by 1 for the next page

        return lastPage.length > 0 ? allPages.length : undefined;
      },

      initialPageParam: PAGE_NUM,
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
          page
            .filter((value) => value.isFollowed && !value.isBlocked)
            .map((v, i) => (
              <React.Fragment key={i}>
                <PostProfileMyFollowContainer
                  key={i}
                  onClick={() => navigate(`${PROFILE_LIST_PATH}/${v.username}`)}
                >
                  <PostProfileMyFollowWrap>
                    <ProfileImgUsernameWrap>
                      <PostProfileMyFollowImg src={v.profilePath} />
                      <PostProfileMyFollowUsername>
                        {v.username}
                      </PostProfileMyFollowUsername>
                    </ProfileImgUsernameWrap>
                  </PostProfileMyFollowWrap>
                </PostProfileMyFollowContainer>
              </React.Fragment>
            )),
        )}

      <div ref={ref}> 보인다.</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

const PostProfileMyFollowContainer = styled.div``;
const PostProfileMyFollowWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 14px 11px 14px;
`;
const ProfileImgUsernameWrap = styled.div`
  display: flex;
`;
const PostProfileMyFollowImg = styled.img`
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  border-radius: 30px;
`;
const PostProfileMyFollowUsername = styled.div`
  margin: auto 0;
  padding-left: 12px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const RepostBorderStickBar = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  height: 1px;
`;

export default ProfileMyFollowingListInfiniteScroll;
