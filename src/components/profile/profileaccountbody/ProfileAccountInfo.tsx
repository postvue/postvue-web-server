import { ReactComponent as ProfileLinkIcon } from 'assets/images/icon/svg/ProfileLinkIcon.svg';
import FollowButton from 'components/common/buttton/FollowButton';
import {
  FOLLOW_LIST_PATH,
  PROFILE_ACCOUNT_ROUTE_PATH,
  PROFILE_EDIT_PATH,
  PROFILE_LIST_PATH,
} from 'const/PathConst';
import { POST_ID_QUERY_PARAM, TAB_QUERY_PARAM } from 'const/QueryParamConst';
import {
  ACCOUNT_SETTING_PROFILE_EDIT_TAB_NAME,
  PROFILE_FOLLOWER_TAB_PARAM,
} from 'const/TabConfigConst';
import {
  isApp,
  sendBasicShareEvent,
  stackRouterPush,
} from 'global/util/reactnative/nativeRouter';
import { handleShareUtil, ShareInfo } from 'global/util/ShareUtil';
import { getOriginFromUrl } from 'global/util/UrlUtil';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React, { useRef } from 'react';
import { generatePath, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isActiveProfileBlockPopupAtom } from 'states/ProfileAtom';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import styled from 'styled-components';

interface ProfileAccountInfoProps {
  username: string;
}

const ProfileAccountInfo: React.FC<ProfileAccountInfoProps> = ({
  username,
}) => {
  const navigate = useNavigate();

  const location = useLocation();

  // URLSearchParams 객체 생성
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get(POST_ID_QUERY_PARAM);

  const { data: profileInfo, isFetched: isFetchedByProfileInfo } =
    QueryStateProfileInfo(username);

  const ProfileAccountInfoRef = useRef<HTMLDivElement>(null);

  const setIsActiveProfileBlockPopup = useSetRecoilState(
    isActiveProfileBlockPopupAtom,
  );

  const setSharePopupInfo = useSetRecoilState(sharePopupInfoAtom);

  const onClickUnblocking = () => {
    setIsActiveProfileBlockPopup(true);
  };

  return (
    <>
      {profileInfo && isFetchedByProfileInfo && username !== '' && (
        <ProfileAccountInfoContainer ref={ProfileAccountInfoRef}>
          <ProfileLayout1Wrap>
            <ProfileImg src={profileInfo.profilePath} />
            <ProfileLayout1SubWrap>
              <ProfileUserNicknameWrap>
                {profileInfo.nickname}
              </ProfileUserNicknameWrap>
              <ProfileUserIdWrap>@{profileInfo.username}</ProfileUserIdWrap>
              <ProfileFollowWrap>
                <div
                  onClick={() => {
                    stackRouterPush(
                      navigate,
                      `${PROFILE_LIST_PATH}/${username}${FOLLOW_LIST_PATH}?${TAB_QUERY_PARAM}=${PROFILE_FOLLOWER_TAB_PARAM}`,
                    );
                  }}
                >
                  <ProfileFollowerWrap>
                    <ProfileFollowerTitle>팔로워</ProfileFollowerTitle>
                    <ProfileFollowerNum>
                      {profileInfo.followerNum}
                    </ProfileFollowerNum>
                  </ProfileFollowerWrap>
                </div>

                <div
                  onClick={() =>
                    stackRouterPush(
                      navigate,
                      `${PROFILE_LIST_PATH}/${username}${FOLLOW_LIST_PATH}`,
                    )
                  }
                >
                  <ProfileFollowingWrap>
                    <ProfileFollowingTitle>팔로잉</ProfileFollowingTitle>
                    <ProfileFollowingNum>
                      {profileInfo.followingNum}
                    </ProfileFollowingNum>
                  </ProfileFollowingWrap>
                </div>
              </ProfileFollowWrap>
            </ProfileLayout1SubWrap>
          </ProfileLayout1Wrap>
          {profileInfo.introduce && (
            <ProfileIntroduceContent>
              {profileInfo.introduce}
            </ProfileIntroduceContent>
          )}
          {profileInfo.website && (
            <Link to={profileInfo.website} target="_blank">
              <ProfileWebsiteIconContentWrap>
                <ProfileWebsiteIconWrap>
                  <ProfileLinkIcon />
                </ProfileWebsiteIconWrap>
                <ProfileWebsiteContent>
                  {profileInfo.website}
                </ProfileWebsiteContent>
              </ProfileWebsiteIconContentWrap>
            </Link>
          )}
          {profileInfo.isMe ? (
            <ProfileLayout2Wrap>
              <ProfileEditButton
                onClick={() => {
                  stackRouterPush(navigate, PROFILE_EDIT_PATH);
                }}
              >
                {ACCOUNT_SETTING_PROFILE_EDIT_TAB_NAME}
              </ProfileEditButton>

              <ProfileShareButton
                onClick={() => {
                  // setSharePopupInfo({
                  //   isActive: true,
                  //   shareLink: window.location.href,
                  //   mainImageUrl: profileInfo.profilePath,
                  // });

                  const shareInfo: ShareInfo = {
                    text: '특별한 순간을 함께 눈으로 확인해 보실래요? ❤️',
                    url:
                      getOriginFromUrl(window.location.href) +
                      generatePath(PROFILE_ACCOUNT_ROUTE_PATH, {
                        username: profileInfo.username,
                      }),
                  };

                  if (isApp()) {
                    sendBasicShareEvent(shareInfo);
                  } else {
                    handleShareUtil(shareInfo);
                  }
                }}
              >
                프로필 공유
              </ProfileShareButton>
            </ProfileLayout2Wrap>
          ) : (
            <>
              {profileInfo && !profileInfo.isBlockerUser && (
                <ProfileLayout2Wrap>
                  {profileInfo.isBlocked && (
                    <ProfileUnblockingButton onClick={onClickUnblocking}>
                      차단 해제
                    </ProfileUnblockingButton>
                  )}
                  {!profileInfo.isBlocked && (
                    <>
                      <FollowButton
                        userId={profileInfo.userId}
                        username={profileInfo.username}
                        isFollow={profileInfo.isFollowed}
                        postId={postId || ''}
                        FollowButtonContainerStyle={{ width: '100%' }}
                        FollowButton={
                          <ProfileFollowButton>팔로우</ProfileFollowButton>
                        }
                        FollowCancelButton={
                          <ProfileAlreedyFollowButton>
                            팔로잉
                          </ProfileAlreedyFollowButton>
                        }
                        hasFollowCancelButton={true}
                      />
                    </>
                  )}

                  {!profileInfo.isBlocked && (
                    <ProfileMsgSendButton
                      onClick={() => {
                        // 나중에 수정바람
                        // stackRouterPush(
                        //   navigate,
                        //   `${MESSAGE_PATH}/${profileInfo.username}${CONVERSTAION_PATH}`,
                        // );

                        const shareInfo: ShareInfo = {
                          text: '특별한 순간을 함께 눈으로 확인해 보실래요? ❤️',
                          url:
                            getOriginFromUrl(window.location.href) +
                            generatePath(PROFILE_ACCOUNT_ROUTE_PATH, {
                              username: profileInfo.username,
                            }),
                        };
                        if (isApp()) {
                          sendBasicShareEvent(shareInfo);
                        } else {
                          handleShareUtil(shareInfo);
                        }
                      }}
                    >
                      프로필 공유
                    </ProfileMsgSendButton>
                  )}
                </ProfileLayout2Wrap>
              )}
            </>
          )}
        </ProfileAccountInfoContainer>
      )}
    </>
  );
};

const ProfileAccountInfoContainer = styled.div`
  z-index: 98;
  max-width: 100vw;
  position: -webkit-sticky;
  position: sticky;
  background-color: ${({ theme }) => theme.mainColor.White};
  padding: 0 20px 20px 20px;
`;

const ProfileLayout1Wrap = styled.div`
  display: flex;
  padding: 14px 0 10px 0;
`;

const ProfileImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 64px;
  object-fit: cover;
`;

const ProfileLayout1SubWrap = styled.div`
  margin: auto 12px auto 12px;
`;

const ProfileUserNicknameWrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
`;

const ProfileUserIdWrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey6};
`;

const ProfileFollowWrap = styled.div`
  display: flex;
  gap: 7px;
`;

const ProfileFollowerWrap = styled.div`
  display: flex;
  gap: 2px;
  cursor: pointer;
`;

const ProfileFollowerTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey7};
`;

const ProfileFollowerNum = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  margin: auto 0;
`;

const ProfileFollowingWrap = styled(ProfileFollowerWrap)``;

const ProfileFollowingTitle = styled(ProfileFollowerTitle)``;

const ProfileFollowingNum = styled(ProfileFollowerNum)``;

const ProfileIntroduceContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  white-space: pre-line;
  padding-bottom: 10px;
`;

const ProfileWebsiteIconContentWrap = styled.div`
  display: flex;
  gap: 3px;
  padding-bottom: 10px;
`;

const ProfileWebsiteIconWrap = styled.div`
  width: 10px;
  height: 10px;
  display: flex;
  margin: auto 0px;
`;

const ProfileWebsiteContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey7};
`;

const ProfileLayout2Wrap = styled.div`
  display: flex;
  gap: 7px;
`;

const ProfileEditButton = styled.div`
  background-color: ${({ theme }) => theme.mainColor.White};
  width: 100%;
  text-align: center;
  border-radius: 9px;
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  padding: 7px 0;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  color: ${({ theme }) => theme.grey.Grey8};
  cursor: pointer;
`;

const ProfileShareButton = styled(ProfileEditButton)``;

const ProfileAlreedyFollowButton = styled(ProfileEditButton)``;

const ProfileFollowButton = styled(ProfileEditButton)`
  background-color: ${({ theme }) => theme.mainColor.Blue};
  color: ${({ theme }) => theme.mainColor.White};
  border: 0px;
`;

const ProfileUnblockingButton = styled(ProfileEditButton)``;

const ProfileMsgSendButton = styled(ProfileEditButton)``;

export default ProfileAccountInfo;
