import { useQuery } from '@tanstack/react-query';
import { ACCOUNT_INFO_HEADER_OFFSET_SCROLL_THRESHOLD } from 'const/AccountConst';
import {
  FOLLOW_LIST_PATH,
  PROFILE_EDIT_PATH,
  PROFILE_LIST_PATH,
} from 'const/PathConst';
import {
  QUERY_STATE_PROFILE_ACCOUNT_INFO,
  SERACH_FAVORITE_TERMS_STALE_TIME,
} from 'const/QueryClientConst';
import { TAB_QUERY_PARAM } from 'const/QueryParamConst';
import { PROFILE_FOLLOWER_TAB_PARAM } from 'const/TabConfigConst';
import { ProfileInfo } from 'global/interface/profile';
import { handleShareUtil } from 'global/util/shareUtil';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProfileInfo } from 'services/profile/getProfileInfo';
import styled from 'styled-components';

const ProfileAccountInfo: React.FC = () => {
  const navigate = useNavigate();

  const param = useParams();
  const username = param.username || '';
  const { data, isLoading } = useQuery<ProfileInfo>({
    queryKey: [QUERY_STATE_PROFILE_ACCOUNT_INFO, username],
    queryFn: () => getProfileInfo(username),
    staleTime: SERACH_FAVORITE_TERMS_STALE_TIME,
  });

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [offset, setOffset] = useState(0);

  const ProfileAccountInfoRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    // 스크롤 차이가 200px 이상일 때만 offset을 업데이트
    if (
      Math.abs(currentScrollPos - prevScrollPos) >
      ACCOUNT_INFO_HEADER_OFFSET_SCROLL_THRESHOLD
    ) {
      if (currentScrollPos > prevScrollPos) {
        // 프로필 정보 높이 만큼 offset, 만약 null시 150 크기 만큼 offset(이동 숨김)
        setOffset(ProfileAccountInfoRef.current?.offsetHeight || 150);
      } else {
        setOffset(0);
      }

      setPrevScrollPos(currentScrollPos);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, handleScroll]);

  return (
    <>
      {data && !isLoading && username !== '' && (
        <ProfileAccountInfoContainer
          offset={offset}
          ref={ProfileAccountInfoRef}
        >
          <ProfileLayout1Wrap>
            <ProfileImg src={data.profilePath} />
            <ProfileLayout1SubWrap>
              <ProfileUserIdWrap>{data.username}</ProfileUserIdWrap>
              <ProfileFollowWrap>
                <Link
                  to={`${PROFILE_LIST_PATH}/${username}${FOLLOW_LIST_PATH}`}
                >
                  <ProfileFollowingWrap>
                    <ProfileFollowingTitle>팔로잉</ProfileFollowingTitle>
                    <ProfileFollowingNum>000</ProfileFollowingNum>
                  </ProfileFollowingWrap>
                </Link>
                <Link
                  to={`${PROFILE_LIST_PATH}/${username}${FOLLOW_LIST_PATH}?${TAB_QUERY_PARAM}=${PROFILE_FOLLOWER_TAB_PARAM}`}
                >
                  <ProfileFollowerWrap>
                    <ProfileFollowerTitle>팔로워</ProfileFollowerTitle>
                    <ProfileFollowerNum>000</ProfileFollowerNum>
                  </ProfileFollowerWrap>
                </Link>
              </ProfileFollowWrap>
            </ProfileLayout1SubWrap>
          </ProfileLayout1Wrap>
          {data.isMe ? (
            <ProfileLayout2Wrap>
              <ProfileEditButton
                onClick={() => {
                  navigate(PROFILE_EDIT_PATH);
                }}
              >
                프로필 수정
              </ProfileEditButton>

              <ProfileShareButton
                onClick={() =>
                  handleShareUtil({
                    url: window.location.href,
                    text: '이것 좀 보세요! 👀',
                  })
                }
              >
                프로필 공유
              </ProfileShareButton>
            </ProfileLayout2Wrap>
          ) : (
            <ProfileLayout2Wrap>
              {data.isFollowed ? (
                <ProfileAlreedyFollowButton>팔로잉</ProfileAlreedyFollowButton>
              ) : (
                <ProfileFollowButton>팔로우</ProfileFollowButton>
              )}

              <ProfileMsgSendButton>메시지 보내기</ProfileMsgSendButton>
            </ProfileLayout2Wrap>
          )}
        </ProfileAccountInfoContainer>
      )}
    </>
  );
};

const ProfileAccountInfoContainer = styled.div<{ offset: number }>`
  top: calc(
    ${({ theme }) => theme.systemSize.header.height} - var(--offset, 0px)
  );
  z-index: 98;
  max-width: 100vw;
  transition: top 0.5s;
  position: -webkit-sticky;
  position: sticky;
  --offset: ${(props) => props.offset}px;
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
`;

const ProfileLayout1SubWrap = styled.div`
  margin: auto 12px auto 12px;
`;

const ProfileUserIdWrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
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

const ProfileMsgSendButton = styled(ProfileEditButton)``;

export default ProfileAccountInfo;
