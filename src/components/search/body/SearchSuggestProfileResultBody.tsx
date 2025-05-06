import NoResultComponentInfinite from 'components/common/container/NoResultComponentInfitie';
import ProfileFollowComponent from 'components/profile/followlist/ProfileFollowComponent';
import { QueryStateSearchProfileUserListInfinite } from 'hook/queryhook/QueryStateSearchProfileUserListInfinite';
import SearchProfileWithFollowListInfiniteScroll from 'hook/SearchProfileWithFollowListInfiniteScroll';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchSuggestBodyProps {
  searchTempWordQuery: string;
}

const SearchSuggestProfileResultBody: React.FC<SearchSuggestBodyProps> = ({
  searchTempWordQuery,
}) => {
  const navigate = useNavigate();

  const { data, isFetched } =
    QueryStateSearchProfileUserListInfinite(searchTempWordQuery);

  return (
    <>
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
          .length <= 0 && <NoResultComponentInfinite />}
      <SearchProfileWithFollowListInfiniteScroll
        username={searchTempWordQuery}
      />
    </>
  );
};

export default SearchSuggestProfileResultBody;
