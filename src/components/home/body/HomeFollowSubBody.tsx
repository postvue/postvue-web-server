import {
  POST_DETAIL_POPUP_PARAM,
  POST_DETAIL_POST_ID_PARAM,
  POST_DETAIL_PROFILE_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import React, { useEffect, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import {
  PROFILE_ACCOUNT_ROUTE_PATH,
  PROFILE_POST_LIST_PATH,
} from '../../../const/PathConst';
import { RecommFollowInfo } from '../../../global/interface/recomm';
import { getRecommFollowList } from '../../../services/recomm/getRecommFollowList';
import theme from '../../../styles/theme';
import FollowButton from '../../common/buttton/FollowButton';

const HomeFollowSubBody: React.FC = () => {
  const [recommFollowList, setRecommFollowList] = useState<RecommFollowInfo[]>(
    [],
  );

  useEffect(() => {
    getRecommFollowList().then((value) => setRecommFollowList(value));
  }, []);

  const navigate = useNavigate();
  return (
    <HomeFollowSubBodyContainer>
      <HomeFollowSubTitleWrap>
        <HomeFollowSubscribeMainTitle>
          아직 팔로잉하고 있는 계정이 없어요
        </HomeFollowSubscribeMainTitle>
        <HomeFollowSubscribeSubTitle>
          관심있는 계정을 팔로우 해보세요.
        </HomeFollowSubscribeSubTitle>
      </HomeFollowSubTitleWrap>
      {recommFollowList.map((value, index) => {
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
                <MyProfileScrapImgWrap
                  key={k}
                  onClick={() => {
                    if (window.innerWidth > MEDIA_MOBILE_MAX_WIDTH_NUM) {
                      // 데스크탑 크기
                      // url로 이동

                      navigate(
                        generatePath(PROFILE_POST_LIST_PATH, {
                          user_id: value.username,
                          post_id: image.postId,
                        }),
                        {
                          state: { isDetailPopup: true },
                        },
                      );
                    } else {
                      // 모바일 크기
                      // url만 바뀌도록 변경
                      // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
                      const searchParams = new URLSearchParams(location.search);

                      searchParams.set(POST_DETAIL_POPUP_PARAM, TRUE_PARAM);
                      searchParams.set(POST_DETAIL_POST_ID_PARAM, image.postId);
                      searchParams.set(
                        POST_DETAIL_PROFILE_PARAM,
                        value.username,
                      );

                      // 새로운 쿼리 파라미터가 포함된 URL 생성
                      const newSearch = searchParams.toString();
                      const newPath = `${location.pathname}?${newSearch}`;

                      navigate(newPath, {
                        state: { isDetailPopup: true },
                      });
                    }
                  }}
                >
                  <MyProfileScrapImg src={image.content} />
                </MyProfileScrapImgWrap>
              ))}
            </MyProfileScrapImgListWrap>
          </RecommFollowInfoWrap>
        );
      })}
    </HomeFollowSubBodyContainer>
  );
};

const HomeFollowSubBodyContainer = styled.div`
  padding: 0 21px;
  padding-bottom: ${({ theme }) =>
    theme.systemSize.bottomNavBar.heightNum * 2}px;
`;

const HomeFollowSubTitleWrap = styled.div`
  padding-bottom: 35px;
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

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MyProfileScrapImgWrap = styled.div`
  // width: 40%;
  // width: 30%;
  width: 100%;
  // flex: 0 0 auto;
  ${filterBrigntnessStyle}
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
