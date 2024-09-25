import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import FollowButton from 'components/common/buttton/FollowButton';
import { PAGE_NUM } from 'const/PageConfigConst';
import { PROFILE_LIST_PATH } from 'const/PathConst';
import { QUERY_STATE_PROFILE_FOLLOWING_LIST } from 'const/QueryClientConst';
import { PostProfileInfoRsp } from 'global/interface/post';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { getProfileFollowingList } from 'services/profile/getProfileFollowingList';
import styled from 'styled-components';
import theme from 'styles/theme';

interface ProfileFollowingListInfiniteScrollProps {
  username: string;
}

const ProfileFollowingListInfiniteScroll: React.FC<
  ProfileFollowingListInfiniteScrollProps
> = ({ username }) => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useInfiniteQuery<PostProfileInfoRsp[], AxiosError>({
      queryKey: [QUERY_STATE_PROFILE_FOLLOWING_LIST, username], // query key
      queryFn: async ({ pageParam }) => {
        // pageParam이 string인지 확인

        if (typeof pageParam !== 'number') {
          // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
          return [];
        }

        return getProfileFollowingList(username, pageParam);
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
            .filter((value) => !value.isBlocked)
            .map((v, i) => (
              <React.Fragment key={i}>
                <PostProfileFollowContainer
                  key={i}
                  onClick={() => navigate(`${PROFILE_LIST_PATH}/${v.username}`)}
                >
                  <PostProfileFollowWrap>
                    <ProfileImgUsernameWrap>
                      <PostProfileFollowImg src={v.profilePath} />
                      <PostProfileFollowNickUsernameWrap>
                        <PostProfileFollowNickname>
                          {v.nickname}
                        </PostProfileFollowNickname>
                        <PostProfileFollowUsername>
                          @{v.username}
                        </PostProfileFollowUsername>
                      </PostProfileFollowNickUsernameWrap>
                    </ProfileImgUsernameWrap>

                    {v.isMe ? (
                      ''
                    ) : (
                      <FollowButton
                        fontSize={theme.fontSizes.Subhead3}
                        userId={v.useId}
                        isFollow={v.isFollowed}
                      />
                    )}
                  </PostProfileFollowWrap>
                </PostProfileFollowContainer>
                <RepostBorderStickBar />
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

const PostProfileFollowContainer = styled.div`
  cursor: pointer;
`;
const PostProfileFollowWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 14px 11px 20px;
`;
const ProfileImgUsernameWrap = styled.div`
  display: flex;
`;
const PostProfileFollowImg = styled.img`
  width: 51px;
  height: 51px;
  flex-shrink: 0;
  border-radius: 30px;
`;

const PostProfileFollowNickUsernameWrap = styled.div`
  padding-left: 12px;
  margin: auto 0;
`;

const PostProfileFollowNickname = styled.div`
  color: ${({ theme }) => theme.grey.Grey8};
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const PostProfileFollowUsername = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey6};
`;

const RepostBorderStickBar = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  height: 1px;
`;

export default ProfileFollowingListInfiniteScroll;
