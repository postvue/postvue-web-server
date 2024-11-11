import FollowButton from 'components/common/buttton/FollowButton';
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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import theme from 'styles/theme';

const ProfileFollowListBody: React.FC = () => {
  const navigate = useNavigate();
  const [searchParam, setSearchParam] = useSearchParams();
  const [myProfileFollowTab, setMyProfileFollowTab] = useState<string>(
    searchParam.get(TAB_QUERY_PARAM) || PROFILE_FOLLOWING_TAB_PARAM,
  );
  const tabParam = searchParam.get(TAB_QUERY_PARAM);

  const params = useParams();
  const username = params.username || '';

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

  const { data: profileFollowerList } =
    QueryStateProfileFollowerListInfinite(username);

  const { data: profileFollowingList } =
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
      <ProfileTabBottomMargin />
      {myProfileFollowTab === PROFILE_FOLLOWING_TAB_PARAM ? (
        <>
          {username && (
            <>
              {profileFollowingList &&
                profileFollowingList.pages.flatMap((page) =>
                  page
                    .filter((value) => !value.isBlocked)
                    .map((v, i) => (
                      <React.Fragment key={i}>
                        <PostProfileFollowContainer
                          key={i}
                          onClick={() =>
                            navigate(`${PROFILE_LIST_PATH}/${v.username}`)
                          }
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
                                userId={v.userId}
                                isFollow={v.isFollowed}
                              />
                            )}
                          </PostProfileFollowWrap>
                        </PostProfileFollowContainer>
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
              {profileFollowerList &&
                profileFollowerList.pages.flatMap((page) =>
                  page
                    .filter((value) => !value.isBlocked)
                    .map((v, i) => (
                      <React.Fragment key={i}>
                        <PostProfileFollowContainer
                          key={i}
                          onClick={() =>
                            navigate(`${PROFILE_LIST_PATH}/${v.username}`)
                          }
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
                                userId={v.userId}
                                isFollow={v.isFollowed}
                              />
                            )}
                          </PostProfileFollowWrap>
                        </PostProfileFollowContainer>
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

const ProfileFollowListBodyContainer = styled.div`
  padding-top: ${({ theme }) => theme.systemSize.header.height};
`;

const ProfileFollowTabWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 17px;
  border-bottom: 1px solid ${({ theme }) => theme.grey.Grey2};
  position: fixed;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
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

const ProfileTabBottomMargin = styled.div`
  margin-bottom: 43px;
`;

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
`;

const RepostBorderStickBar = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  height: 1px;
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

export default ProfileFollowListBody;
