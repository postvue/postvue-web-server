import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { FOLLOW_LIST_PATH, PROFILE_LIST_PATH } from 'const/PathConst';
import { TAB_QUERY_PARAM } from 'const/QueryParamConst';
import {
  PROFILE_FOLLOWER_NAME,
  PROFILE_FOLLOWER_TAB_PARAM,
  PROFILE_FOLLOWING_NAME,
  PROFILE_FOLLOWING_TAB_PARAM,
} from 'const/TabConfigConst';
import ProfileFollowerListInfiniteScroll from 'hook/ProfileFollowerListInfiniteScroll';
import ProfileFollowingListInfiniteScroll from 'hook/ProfileFollowingListInfiniteScroll';
import { QueryStateProfileFollowerListInfinite } from 'hook/queryhook/QueryStateProfileFollowerListInfinite';
import { QueryStateProfileFollowingListInfinite } from 'hook/queryhook/QueryStateProfileFollowingListInfinite';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import ProfileFollowComponent from './ProfileFollowComponent';

interface ProfileFollowListBodyProps {
  username: string;
}

const ProfileFollowListBody: React.FC<ProfileFollowListBodyProps> = ({
  username,
}) => {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const [myProfileFollowTab, setMyProfileFollowTab] = useState<string>(
    searchParam.get(TAB_QUERY_PARAM) || PROFILE_FOLLOWING_TAB_PARAM,
  );
  const tabParam = searchParam.get(TAB_QUERY_PARAM);

  const myProfileFollowTabList = [
    {
      tabName: PROFILE_FOLLOWER_NAME,
      param: PROFILE_FOLLOWER_TAB_PARAM,
    },
    {
      tabName: PROFILE_FOLLOWING_NAME,
      param: PROFILE_FOLLOWING_TAB_PARAM,
    },
  ];

  useEffect(() => {
    if (tabParam === PROFILE_FOLLOWER_TAB_PARAM) {
      setMyProfileFollowTab(PROFILE_FOLLOWER_TAB_PARAM);
    } else {
      setMyProfileFollowTab(PROFILE_FOLLOWING_TAB_PARAM);
    }
  }, [tabParam]);

  const { data } = QueryStateProfileInfo(username);

  const { data: profileFollowerList, isFetched: isFetchedByProfileFollower } =
    QueryStateProfileFollowerListInfinite(username);

  const { data: profileFollowingList, isFetched: isFetchedByProfileFollowing } =
    QueryStateProfileFollowingListInfinite(username);

  return (
    <ProfileFollowListBodyContainer>
      <ProfileFollowTabWrap>
        {myProfileFollowTabList.map((v, i) => (
          <ContentTab
            key={i}
            className={myProfileFollowTab === v.param ? ACTIVE_CLASS_NAME : ''}
            onClick={() => {
              setMyProfileFollowTab(v.param);
              navigate(
                `${PROFILE_LIST_PATH}/${username}${FOLLOW_LIST_PATH}?${TAB_QUERY_PARAM}=${v.param}`,
                { replace: true },
              );
            }}
          >
            {`${
              v.param === PROFILE_FOLLOWING_TAB_PARAM
                ? data?.followingNum.toLocaleString()
                : data?.followerNum.toLocaleString()
            } ${v.tabName}`}
          </ContentTab>
        ))}
      </ProfileFollowTabWrap>

      {myProfileFollowTab === PROFILE_FOLLOWING_TAB_PARAM ? (
        <>
          {username && (
            <>
              {isFetchedByProfileFollowing &&
                profileFollowingList &&
                profileFollowingList.pages.flatMap((page) =>
                  page
                    .filter((value) => !value.isBlocked)
                    .map((v, i) => (
                      <React.Fragment key={i}>
                        <ProfileFollowComponent
                          isMe={v.isMe}
                          profilePath={v.profilePath}
                          nickname={v.nickname}
                          username={v.username}
                          userId={v.userId}
                          isFollowed={v.isFollowed}
                        />
                        <RepostBorderStickBar />
                      </React.Fragment>
                    )),
                )}
              <ProfileFollowingListInfiniteScroll username={username} />
            </>
          )}
        </>
      ) : (
        <>
          {username && (
            <>
              {isFetchedByProfileFollower &&
                profileFollowerList &&
                profileFollowerList.pages.flatMap((page) =>
                  page
                    .filter((value) => !value.isBlocked)
                    .map((v, i) => (
                      <React.Fragment key={i}>
                        <ProfileFollowComponent
                          isMe={v.isMe}
                          profilePath={v.profilePath}
                          nickname={v.nickname}
                          username={v.username}
                          userId={v.userId}
                          isFollowed={v.isFollowed}
                        />
                        <RepostBorderStickBar />
                      </React.Fragment>
                    )),
                )}
              <ProfileFollowerListInfiniteScroll username={username} />
            </>
          )}
        </>
      )}
    </ProfileFollowListBodyContainer>
  );
};

const ProfileFollowListBodyContainer = styled.div``;

const ProfileFollowTabWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 17px;
  border-bottom: 1px solid ${({ theme }) => theme.grey.Grey2};
  position: sticky;
  width: 100%;
  top: ${({ theme }) => theme.systemSize.header.height};

  background-color: ${({ theme }) => theme.mainColor.White};
`;

const ContentTab = styled.div`
  width: 100%;
  text-align: center;

  padding-bottom: 5px;
  font: ${({ theme }) => theme.fontSizes.Subhead2};

  cursor: pointer;

  &.active {
    border-bottom: 2px solid;
  }
`;

const RepostBorderStickBar = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  height: 1px;
`;

export default ProfileFollowListBody;
