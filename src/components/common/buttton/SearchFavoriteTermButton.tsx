import React, { useEffect, useState } from 'react';

import { queryClient } from 'App';

import { FAVORITE_TERM_ADD_BOOKMARK_TEXT } from 'const/SystemPhraseConst';
import { SearchPostQueryInterface } from 'hook/SearchPostListInfiniteScroll';
import styled from 'styled-components';

import { ReactComponent as SearchFavoriteButtonIcon } from 'assets/images/icon/svg/searchfavorite/SearchFavoriteButtonIcon.svg';
import { ReactComponent as SearchFavoriteNotActiveButtonIcon } from 'assets/images/icon/svg/searchfavorite/SearchFavoriteNotActiveButtonIcon.svg';
import { notify } from 'components/popups/ToastMsgPopup';
import { PostRsp } from 'global/interface/post';
import { QueryMutationSearchFavoriteTermList } from 'hook/queryhook/QueryMutationSearchFavoriteTerm';
import { QueryStateSearchFavoriteTermList } from 'hook/queryhook/QueryStateSearchFavoriteTermList';

interface SearchFavoriteTermButtonProps {
  searchQueryAndFilterKey?: string;
  searchWord: string;
}

const SearchFavoriteTermButton: React.FC<SearchFavoriteTermButtonProps> = ({
  searchQueryAndFilterKey = '',
  searchWord,
}) => {
  const putMutationSearchFavoriteTerm = QueryMutationSearchFavoriteTermList();
  const [isBookMarkedFavoriteTerm, setIsBookMarkedFavoriteTerm] =
    useState<boolean>(false);

  const { data } = QueryStateSearchFavoriteTermList();

  const onClickBookmarkFavorite = () => {
    const searchPostQueryPageList: SearchPostQueryInterface | undefined =
      queryClient.getQueryData([searchQueryAndFilterKey]);

    let searchPostList: PostRsp[];
    if (searchPostQueryPageList) {
      searchPostList = searchPostQueryPageList?.pages.flatMap(
        (page) => page.snsPostRspList,
      );
    } else {
      searchPostList = [];
    }

    let favoriteTermContent = '';
    let favoriteTermContentType = '';
    if (searchPostList.length > 0) {
      if (!isBookMarkedFavoriteTerm) {
        const randomSearchPost =
          searchPostList[Math.floor(Math.random() * searchPostList.length)];
        const randomPostContent =
          randomSearchPost.postContents[
            Math.floor(Math.random() * randomSearchPost.postContents.length)
          ];
        favoriteTermContent = randomPostContent.content;
        favoriteTermContentType = randomPostContent.postContentType;
      }
    }

    putMutationSearchFavoriteTerm.mutate({
      isFavorite: !isBookMarkedFavoriteTerm,
      favoriteTerm: searchWord,
      favoriteTermContent: favoriteTermContent,
      favoriteTermContentType: favoriteTermContentType,
    });
  };

  useEffect(() => {
    setIsBookMarkedFavoriteTerm(
      data?.some((value) => value.favoriteTermName === searchWord) || false,
    );

    if (putMutationSearchFavoriteTerm.data) {
      setIsBookMarkedFavoriteTerm(putMutationSearchFavoriteTerm.data);
      notify(FAVORITE_TERM_ADD_BOOKMARK_TEXT);
    }
  }, [data, searchWord, putMutationSearchFavoriteTerm.data]);

  return (
    <>
      <FavoriteTermButton onClick={onClickBookmarkFavorite}>
        {isBookMarkedFavoriteTerm ? (
          <SearchFavoriteButtonIcon />
        ) : (
          <SearchFavoriteNotActiveButtonIcon />
        )}
      </FavoriteTermButton>
    </>
  );
};

const FavoriteTermButton = styled.div`
  display: flex;
  margin-right: 10px;
  cursor: pointer;
`;

export default SearchFavoriteTermButton;
