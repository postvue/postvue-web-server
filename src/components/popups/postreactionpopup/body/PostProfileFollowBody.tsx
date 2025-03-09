import NoResultComponent from 'components/common/container/NoResultComponent';
import { PROFILE_ACCOUNT_ROUTE_PATH } from 'const/PathConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { isApp, stackRouterPush } from 'global/util/reactnative/nativeRouter';
import PostLikeListInfiniteScroll from 'hook/PostLikeListInfiniteScroll';
import { QueryStatePostLikeListInfinite } from 'hook/queryhook/QueryStatePostLikeListInfinite';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isPostReactionAtom } from 'states/PostReactionAtom';
import styled from 'styled-components';
import theme from '../../../../styles/theme';
import FollowButton from '../../../common/buttton/FollowButton';

interface PostProfileFollowBodyProps {
  postId: string;
}

const PostProfileFollowBody: React.FC<PostProfileFollowBodyProps> = ({
  postId,
}) => {
  const setIsPopupActive = useSetRecoilState(isPostReactionAtom);
  const navigate = useNavigate();

  const { data: postProfileLikeList, isFetched: isFetchedByPostProfileLike } =
    QueryStatePostLikeListInfinite(postId);
  return (
    <>
      {isFetchedByPostProfileLike && (
        <>
          {postProfileLikeList?.pages
            .flatMap((v) => v.snsPostLikeGetRspList)
            .map((v, k) => {
              return (
                <React.Fragment key={k}>
                  <PostProfileFollowContainer key={k}>
                    <PostProfileFollowWrap>
                      <PostProfileFollowSubWrap
                        onClick={() => {
                          const data: RoutePushEventDateInterface = {
                            isShowInitBottomNavBar: true,
                          };
                          stackRouterPush(
                            navigate,
                            generatePath(PROFILE_ACCOUNT_ROUTE_PATH, {
                              username: v.username,
                            }),
                            data,
                          );
                          if (!isApp()) {
                            setIsPopupActive(false);
                            window.scrollTo(0, 0);
                          }
                        }}
                      >
                        <ProfileImgUsernameWrap>
                          <PostProfileFollowImg src={v.profilePath} />
                          <PostProfileFollowUsername>
                            {v.username}
                          </PostProfileFollowUsername>
                        </ProfileImgUsernameWrap>
                      </PostProfileFollowSubWrap>
                      {v.isMe ? (
                        ''
                      ) : (
                        <FollowButton
                          fontSize={theme.fontSizes.Subhead3}
                          userId={v.userId}
                          username={v.username}
                          isFollow={v.isFollowed}
                        />
                      )}
                    </PostProfileFollowWrap>
                  </PostProfileFollowContainer>
                  <RepostBorderStickBar />
                </React.Fragment>
              );
            })}
          {postProfileLikeList &&
            postProfileLikeList?.pages.flatMap((v) => v.snsPostLikeGetRspList)
              .length <= 0 && (
              <NoResultComponent title={'좋아요를 해주세요.'} />
            )}
        </>
      )}

      <PostLikeListInfiniteScroll postId={postId} />
    </>
  );
};

const PostProfileFollowContainer = styled.div``;
const PostProfileFollowWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 20px 11px 20px;
`;

const PostProfileFollowSubWrap = styled.div`
  width: 100%;
  cursor: pointer;
`;
const ProfileImgUsernameWrap = styled.div`
  display: flex;
`;
const PostProfileFollowImg = styled.img`
  width: 51px;
  height: 51px;
  flex-shrink: 0;
  border-radius: 30px;
  object-fit: cover;
`;
const PostProfileFollowUsername = styled.div`
  margin: auto 0;
  padding-left: 12px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const RepostBorderStickBar = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  height: 1px;
`;

export default PostProfileFollowBody;
