import { ReactComponent as ProfileLinkIcon } from 'assets/images/icon/svg/ProfileLinkIcon.svg';
import FollowButton from 'components/common/buttton/FollowButton';
import {
  CONVERSTAION_PATH,
  FOLLOW_LIST_PATH,
  MESSAGE_PATH,
  PROFILE_EDIT_PATH,
  PROFILE_LIST_PATH,
} from 'const/PathConst';
import { TAB_QUERY_PARAM } from 'const/QueryParamConst';
import { PROFILE_FOLLOWER_TAB_PARAM } from 'const/TabConfigConst';
import { stackRouterPush } from 'global/util/reactnative/StackRouter';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React, { useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isActiveProfileBlockPopupAtom } from 'states/ProfileAtom';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import styled from 'styled-components';

const ProfileAccountInfo: React.FC = () => {
  const navigate = useNavigate();

  const param = useParams();
  const username = param.username || '';
  const { data, isFetched } = QueryStateProfileInfo(username);

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
      {data && isFetched && username !== '' && (
        <ProfileAccountInfoContainer ref={ProfileAccountInfoRef}>
          <ProfileLayout1Wrap>
            <ProfileImg src={data.profilePath} />
            <ProfileLayout1SubWrap>
              <ProfileUserNicknameWrap>{data.nickname}</ProfileUserNicknameWrap>
              <ProfileUserIdWrap>@{data.username}</ProfileUserIdWrap>
              <ProfileFollowWrap>
                <div
                  onClick={() =>
                    stackRouterPush(
                      navigate,
                      `${PROFILE_LIST_PATH}/${username}${FOLLOW_LIST_PATH}?${TAB_QUERY_PARAM}=${PROFILE_FOLLOWER_TAB_PARAM}`,
                    )
                  }
                >
                  <ProfileFollowerWrap>
                    <ProfileFollowerTitle>팔로워</ProfileFollowerTitle>
                    <ProfileFollowerNum>{data.followerNum}</ProfileFollowerNum>
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
                      {data.followingNum}
                    </ProfileFollowingNum>
                  </ProfileFollowingWrap>
                </div>
              </ProfileFollowWrap>
            </ProfileLayout1SubWrap>
          </ProfileLayout1Wrap>
          {data.introduce && (
            <ProfileIntroduceContent>{data.introduce}</ProfileIntroduceContent>
          )}
          {data.website && (
            <Link to={data.website} target="_blank">
              <ProfileWebsiteIconContentWrap>
                <ProfileWebsiteIconWrap>
                  <ProfileLinkIcon />
                </ProfileWebsiteIconWrap>
                <ProfileWebsiteContent>{data.website}</ProfileWebsiteContent>
              </ProfileWebsiteIconContentWrap>
            </Link>
          )}
          {data.isMe ? (
            <ProfileLayout2Wrap>
              <ProfileEditButton
                onClick={() => {
                  stackRouterPush(navigate, PROFILE_EDIT_PATH);
                }}
              >
                프로필 수정
              </ProfileEditButton>

              <ProfileShareButton
                onClick={() =>
                  setSharePopupInfo({
                    isActive: true,
                    shareLink: window.location.href,
                    mainImageUrl: data.profilePath,
                    isFixed: true,
                  })
                }
              >
                프로필 공유
              </ProfileShareButton>
            </ProfileLayout2Wrap>
          ) : (
            <ProfileLayout2Wrap>
              {data.isBlocked && (
                <ProfileUnblockingButton onClick={onClickUnblocking}>
                  차단 해제
                </ProfileUnblockingButton>
              )}
              {!data.isBlocked && (
                <>
                  <FollowButton
                    userId={data.userId}
                    isFollow={data.isFollowed}
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

              <ProfileMsgSendButton
                onClick={() => {
                  stackRouterPush(
                    navigate,
                    `${MESSAGE_PATH}/${data.username}${CONVERSTAION_PATH}`,
                  );
                }}
              >
                메시지 보내기
              </ProfileMsgSendButton>
            </ProfileLayout2Wrap>
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
  padding: 0 20px 10px 20px;
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
