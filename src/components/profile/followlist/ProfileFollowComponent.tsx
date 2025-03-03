import FollowButton from 'components/common/buttton/FollowButton';
import { PROFILE_ACCOUNT_ROUTE_PATH } from 'const/PathConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface ProfileFollowComponentProps {
  isMe: boolean;
  profilePath: string;
  nickname: string;
  username: string;
  userId: string;
  isFollowed: boolean;
}

const ProfileFollowComponent: React.FC<ProfileFollowComponentProps> = ({
  isMe,
  profilePath,
  nickname,
  username,
  userId,
  isFollowed,
}) => {
  const navigate = useNavigate();
  return (
    <PostProfileFollowContainer
      onClick={() => {
        const data: RoutePushEventDateInterface = {
          isShowInitBottomNavBar: true,
        };

        stackRouterPush(
          navigate,
          generatePath(PROFILE_ACCOUNT_ROUTE_PATH, { username: username }),
          data,
        );
      }}
    >
      <PostProfileFollowWrap>
        <ProfileImgUsernameWrap>
          <PostProfileFollowImg src={profilePath} />
          <PostProfileFollowNickUsernameWrap>
            <PostProfileFollowNickname>{nickname}</PostProfileFollowNickname>
            <PostProfileFollowUsername>@{username}</PostProfileFollowUsername>
          </PostProfileFollowNickUsernameWrap>
        </ProfileImgUsernameWrap>

        {isMe ? (
          ''
        ) : (
          <FollowButton
            fontSize={theme.fontSizes.Subhead3}
            userId={userId}
            username={username}
            isFollow={isFollowed}
          />
        )}
      </PostProfileFollowWrap>
    </PostProfileFollowContainer>
  );
};

const PostProfileFollowContainer = styled.div`
  cursor: pointer;
`;
const PostProfileFollowWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 20px 11px 20px;
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

export default ProfileFollowComponent;
