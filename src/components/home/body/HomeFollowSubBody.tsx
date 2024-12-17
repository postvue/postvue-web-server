import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PROFILE_LIST_PATH } from '../../../const/PathConst';
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
                <Link to={`${PROFILE_LIST_PATH}/${value.username}`}>
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
                </Link>
              </RecommFollowProfileInfoWrap>
              <FollowButton
                fontSize={theme.fontSizes.Subhead3}
                userId={value.followId}
                isFollow={false}
              />
            </RecommFollowProfileInfo>
            <MyProfileScrapImgListWrap>
              {value.postPreviewImgUrlList.map((image, k) => (
                <MyProfileScrapImgWrap
                  key={k}
                  onClick={() => {
                    navigate(`/${value.username}/${image.postId}`);
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
  padding-bottom: ${({ theme }) => theme.systemSize.bottomNavBar.heightNum}px;
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
  width: 30%;
  flex: 0 0 auto;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      filter: brightness(0.7);
    }
  }
  cursor: pointer;
`;

const MyProfileScrapImg = styled.div<{ src: string }>`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3/4;
  background: url(${(props) => props.src}) center center / cover;
  border-radius: 8px;
`;

export default HomeFollowSubBody;
