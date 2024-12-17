import React from 'react';

import styled from 'styled-components';

import { useRecoilValue } from 'recoil';
import { searchWordAtom } from 'states/SearchPostAtom';

import NoResultComponent from 'components/common/container/NoResultComponent';
import ProfileFollowComponent from 'components/profile/followlist/ProfileFollowComponent';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import SearchProfileWithFollowListInfiniteScroll from 'hook/SearchProfileWithFollowListInfiniteScroll';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateSearchProfileUserListInfinite } from 'hook/queryhook/QueryStateSearchProfileUserListInfinite';
import SearchFilterButton from './SearchFilterButton';

const SearchProfileBody: React.FC = () => {
  const searchWord = useRecoilValue(searchWordAtom);

  const { data, isFetched } = QueryStateSearchProfileUserListInfinite(
    searchWord,
    true,
  );

  const { windowWidth } = useWindowSize();

  return (
    <SearchPostBodyContinaer>
      {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM && (
        <SearchFilterContainer>
          <SearchFilterButton />
        </SearchFilterContainer>
      )}

      <SearchPostContainer>
        {data &&
          data.pages.flatMap((page) =>
            page.getProfileUserByUsernameList.map((v, i) => (
              <ProfileFollowComponent
                key={i}
                isMe={false}
                profilePath={v.profilePath}
                nickname={v.nickname}
                username={v.username}
                userId={v.userId}
                isFollowed={v.isFollowed}
              />
            )),
          )}
        {isFetched &&
          data &&
          data?.pages.flatMap((value) => value.getProfileUserByUsernameList)
            .length <= 0 && <NoResultComponent />}
        <SearchProfileWithFollowListInfiniteScroll username={searchWord} />
      </SearchPostContainer>
    </SearchPostBodyContinaer>
  );
};

const SearchPostBodyContinaer = styled.div`
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin-top: ${({ theme }) => theme.systemSize.header.heightNumber}px;
  }
`;
const SearchFilterContainer = styled.div`
  position: sticky;
  z-index: 10;
  width: 100%;
  top: ${({ theme }) => theme.systemSize.header.height};
  background-color: ${({ theme }) => theme.mainColor.White};

  display: flex;
  justify-content: end;
  height: ${({ theme }) => theme.systemSize.header.height};
`;

const SearchPostContainer = styled.div``;

export default SearchProfileBody;
