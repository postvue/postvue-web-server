import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { onFuncRoutePostDetail } from 'global/util/PostUtil';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { QueryStateRecommFollowListInfinite } from 'hook/queryhook/QueryStateRecommFollowListnfinite';
import RecommFollowListListInfiniteScroll from 'hook/RecommFollowListInfiniteScroll';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import { PROFILE_ACCOUNT_ROUTE_PATH } from '../../../const/PathConst';
import theme from '../../../styles/theme';
import FollowButton from '../../common/buttton/FollowButton';

interface HomeFollowSubBodyProps {
  mainTitle?: string;
  subTitle?: string;
}

const HomeFollowSubBody: React.FC<HomeFollowSubBodyProps> = ({
  mainTitle,
  subTitle,
}) => {
  const { data: recommFollowList } = QueryStateRecommFollowListInfinite();

  const navigate = useNavigate();
  return (
    <HomeFollowSubBodyContainer>
      <HomeFollowSubTitleWrap>
        {mainTitle && (
          <HomeFollowSubscribeMainTitle>
            {mainTitle}
          </HomeFollowSubscribeMainTitle>
        )}
        {subTitle && (
          <HomeFollowSubscribeSubTitle>{subTitle}</HomeFollowSubscribeSubTitle>
        )}
      </HomeFollowSubTitleWrap>
      {recommFollowList &&
        recommFollowList.pages
          .flatMap((v) => v)
          .map((value, index) => {
            return (
              <RecommFollowInfoWrap key={index}>
                <RecommFollowProfileInfo>
                  <RecommFollowProfileInfoWrap>
                    <RecommFollowProfileImg src={value.profilePath} />
                    <div
                      onClick={() => {
                        const path = generatePath(PROFILE_ACCOUNT_ROUTE_PATH, {
                          username: value.username,
                        });
                        const data: RoutePushEventDateInterface = {
                          isShowInitBottomNavBar: true,
                        };

                        stackRouterPush(navigate, path, data);
                      }}
                    >
                      <FollowUsernameNumberWrap>
                        <RecommFollowUsername>
                          {value.username}
                        </RecommFollowUsername>
                        <RecommFollowWrap>
                          <RecommFollowFollowingNum>
                            <RecommFollowFollowingTitle>
                              팔로잉
                            </RecommFollowFollowingTitle>{' '}
                            {value.followingNum}
                          </RecommFollowFollowingNum>
                          <RecommFollowFollowerNum>
                            <RecommFollowFollowerTitle>
                              팔로워
                            </RecommFollowFollowerTitle>{' '}
                            {value.followerNum}
                          </RecommFollowFollowerNum>
                        </RecommFollowWrap>
                      </FollowUsernameNumberWrap>
                    </div>
                  </RecommFollowProfileInfoWrap>
                  <FollowButton
                    fontSize={theme.fontSizes.Subhead3}
                    userId={value.followId}
                    username={value.username}
                    isFollow={false}
                  />
                </RecommFollowProfileInfo>
                <MyProfileScrapImgListWrap>
                  {value.postPreviewImgUrlList.slice(0, 3).map((image, k) => (
                    <MyProfileScrapImgContainer key={k}>
                      <MyProfileScrapImgWrap
                        onClick={() => {
                          onFuncRoutePostDetail({
                            navigate: navigate,
                            postId: image.postId,
                            username: value.username,
                          });
                          // if (window.innerWidth > MEDIA_MOBILE_MAX_WIDTH_NUM) {
                          //   // 데스크탑 크기
                          //   // url로 이동

                          //   navigate(
                          //     generatePath(PROFILE_POST_LIST_PATH, {
                          //       user_id: value.username,
                          //       post_id: image.postId,
                          //     }),
                          //     {
                          //       state: { isDetailPopup: true },
                          //     },
                          //   );
                          // } else {
                          //   // 모바일 크기
                          //   // url만 바뀌도록 변경
                          //   // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
                          //   const searchParams = new URLSearchParams(
                          //     location.search,
                          //   );

                          //   searchParams.set(
                          //     POST_DETAIL_POPUP_PARAM,
                          //     TRUE_PARAM,
                          //   );
                          //   searchParams.set(
                          //     POST_DETAIL_POST_ID_PARAM,
                          //     image.postId,
                          //   );
                          //   searchParams.set(
                          //     POST_DETAIL_PROFILE_PARAM,
                          //     value.username,
                          //   );

                          //   // 새로운 쿼리 파라미터가 포함된 URL 생성
                          //   const newSearch = searchParams.toString();
                          //   const newPath = `${location.pathname}?${newSearch}`;

                          //   navigate(newPath, {
                          //     state: { isDetailPopup: true },
                          //   });
                          // }
                        }}
                      >
                        <MyProfileScrapImg src={image.content} />
                      </MyProfileScrapImgWrap>
                    </MyProfileScrapImgContainer>
                  ))}
                </MyProfileScrapImgListWrap>
              </RecommFollowInfoWrap>
            );
          })}
      <RecommFollowListListInfiniteScroll />
    </HomeFollowSubBodyContainer>
  );
};

const HomeFollowSubBodyContainer = styled.div`
  padding: 0 21px;
  padding-bottom: ${({ theme }) =>
    theme.systemSize.bottomNavBar.heightNum * 2}px;
`;

const HomeFollowSubTitleWrap = styled.div`
  padding-bottom: 25px;
  gap: 5px;
  display: flex;
  flex-flow: column;
`;

const HomeFollowSubscribeMainTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
`;

const HomeFollowSubscribeSubTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  opacity: 0.6;
`;

const RecommFollowInfoWrap = styled.div`
  padding-bottom: 20px;
`;

const RecommFollowProfileInfo = styled.div`
  display: flex;
  padding-bottom: 11px;
  justify-content: space-between;
`;

const RecommFollowProfileInfoWrap = styled.div`
  display: flex;
  gap: 7px;
`;

const RecommFollowProfileImg = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 40px;
  object-fit: cover;
`;

const FollowUsernameNumberWrap = styled.div``;

const RecommFollowUsername = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const RecommFollowWrap = styled.div`
  display: flex;
  gap: 7px;
`;

const RecommFollowFollowerTitle = styled.div`
  opacity: 0.6;
`;

const RecommFollowFollowingTitle = styled(RecommFollowFollowerTitle)``;

const RecommFollowFollowerNum = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 13px;
  display: flex;
  gap: 2px;
`;

const RecommFollowFollowingNum = styled(RecommFollowFollowerNum)``;

const MyProfileScrapImgListWrap = styled.div`
  display: flex;
  gap: 3px;
  overflow-x: auto;
  white-space: nowrap;

  // & {
  //   -ms-overflow-style: none;
  //   scrollbar-width: none;
  // }
  // &::-webkit-scrollbar {
  //   display: none;
  // }
`;

const MyProfileScrapImgContainer = styled.div`
  width: 32%;
  flex: 0 0 auto;
  position: relative;
  ${filterBrigntnessStyle}
`;

const MyProfileScrapImgWrap = styled.div`
  width: 100%;
  cursor: pointer;
`;

const MyProfileScrapImg = styled.div<{ src: string }>`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3/4;
  background: url(${(props) => props.src}) center center / cover;
  border-radius: 15px;
`;

export default HomeFollowSubBody;
