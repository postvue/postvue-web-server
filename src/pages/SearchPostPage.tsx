import React, { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { queryClient } from 'App';
import SearchPostBody from 'components/search/body/SearchPostBody';
import SearchSuggestBody from 'components/search/body/SearchSuggestBody';
import SearchHeader from 'components/search/header/SearchHeader';
import { NAVIGATION_BACK } from 'const/AppConst';
import {
  QUERY_STATE_SEARCH_FAVORITE_TERM_LIST,
  SERACH_FAVORITE_TERMS_STALE_TIME,
} from 'const/QueryClientConst';
import { FAVORITE_TERM_ADD_BOOKMARK_TEXT } from 'const/SystemPhraseConst';
import { GetFavoriteTermRsp } from 'global/interface/search';
import { SearchPostQueryInterface } from 'hook/SearchPostListInfiniteScroll';
import { useRecoilValue } from 'recoil';
import { SEARCH_PATH } from 'services/appApiPath';
import { getFavoriteSearchTerm } from 'services/search/getFavoriteSearchTermList';
import { putFavoriteSearchTerm } from 'services/search/putFavoriteSearchTerm';
import {
  isSearchInputActiveAtom,
  searchQueryAndFilterKeyAtom,
  searchWordAtom,
} from 'states/SearchPostAtom';
import styled from 'styled-components';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ToastPopup, { notify } from '../components/popups/ToastMsgPopup';

const SearchPostPage: React.FC = () => {
  const isSearchInputActive = useRecoilValue(isSearchInputActiveAtom);

  const [isBookMarkedFavoriteTerm, setIsBookMarkedFavoriteTerm] =
    useState<boolean>(false);

  const searchWord = useRecoilValue(searchWordAtom);

  const { data } = useQuery({
    queryKey: [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
    queryFn: () => getFavoriteSearchTerm(),
    staleTime: SERACH_FAVORITE_TERMS_STALE_TIME,
  });

  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  const onClickBookmarkFavorite = () => {
    const searchPostQueryPageList: SearchPostQueryInterface | undefined =
      queryClient.getQueryData([searchQueryAndFilterKey]);

    if (!searchPostQueryPageList) return;
    const searchPostList = searchPostQueryPageList?.pages.flatMap(
      (page) => page.snsPostRspList,
    );

    let favoriteTermContent = '';
    let favoriteTermContentType = '';
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

    putFavoriteSearchTerm({
      isFavorite: !isBookMarkedFavoriteTerm,
      favoriteTerm: searchWord,
      favoriteTermContent: favoriteTermContent,
      favoriteTermContentType: favoriteTermContentType,
    }).then((value) => {
      const favoriteSearchTermList: GetFavoriteTermRsp[] | undefined =
        queryClient.getQueryData([QUERY_STATE_SEARCH_FAVORITE_TERM_LIST]);

      if (!favoriteSearchTermList) return;

      const tempFavoriteSearchTermList = [...favoriteSearchTermList];

      setIsBookMarkedFavoriteTerm(!isBookMarkedFavoriteTerm);
      if (value) {
        notify(FAVORITE_TERM_ADD_BOOKMARK_TEXT);
        queryClient.setQueryData(
          [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
          [
            {
              favoriteTermName: searchWord,
              favoriteTermContent: favoriteTermContent,
              favoriteTermContentType: favoriteTermContentType,
            } as GetFavoriteTermRsp,
            ...tempFavoriteSearchTermList,
          ],
        );
      } else {
        tempFavoriteSearchTermList.filter(
          (value) => value.favoriteTermName !== searchWord,
        );

        queryClient.setQueryData(
          [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST],
          tempFavoriteSearchTermList,
        );
      }
    });
  };

  useEffect(() => {
    setIsBookMarkedFavoriteTerm(
      data?.some((value) => value.favoriteTermName === searchWord) || false,
    );
  }, [data, searchWord]);

  return (
    <AppBaseTemplate>
      <SearchHeader
        backToUrl={SEARCH_PATH}
        navigateType={NAVIGATION_BACK}
        isShowFavoriteTermButton={true && !isSearchInputActive}
        favoriteTermButton={
          <FavoriteTermButton onClick={onClickBookmarkFavorite}>
            {isBookMarkedFavoriteTerm ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M11.6035 3.90013C11.9703 3.15696 13.03 3.15696 13.3969 3.90013L15.4865 8.13342C15.632 8.42827 15.9132 8.63273 16.2385 8.68028L20.913 9.36353C21.733 9.48337 22.0597 10.4912 21.4662 11.0694L18.0853 14.3623C17.8494 14.5921 17.7417 14.9232 17.7974 15.2477L18.5951 19.8986C18.7352 20.7156 17.8777 21.3386 17.144 20.9527L12.9656 18.7554C12.6742 18.6021 12.3261 18.6021 12.0347 18.7554L7.85629 20.9527C7.12266 21.3386 6.26512 20.7156 6.40523 19.8986L7.20292 15.2477C7.25858 14.9232 7.15091 14.5921 6.91504 14.3623L3.53418 11.0694C2.94058 10.4912 3.26736 9.48337 4.08728 9.36353L8.76178 8.68028C9.08713 8.63273 9.36832 8.42827 9.51386 8.13342L11.6035 3.90013Z"
                  fill="#FF3B30"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M11.6035 3.90013C11.9703 3.15696 13.03 3.15696 13.3969 3.90013L15.4865 8.13342C15.632 8.42827 15.9132 8.63273 16.2385 8.68028L20.913 9.36353C21.733 9.48337 22.0597 10.4912 21.4661 11.0694L18.0853 14.3623C17.8494 14.5921 17.7417 14.9232 17.7974 15.2477L18.5951 19.8986C18.7352 20.7156 17.8777 21.3386 17.144 20.9527L12.9656 18.7554C12.6742 18.6021 12.3261 18.6021 12.0347 18.7554L7.85629 20.9527C7.12267 21.3386 6.26512 20.7156 6.40523 19.8986L7.20292 15.2477C7.25858 14.9232 7.15091 14.5921 6.91504 14.3623L3.53418 11.0694C2.94058 10.4912 3.26736 9.48337 4.08728 9.36353L8.76178 8.68028C9.08713 8.63273 9.36832 8.42827 9.51386 8.13342L11.6035 3.90013Z"
                  stroke="#535B63"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </FavoriteTermButton>
        }
      />
      <SearchPostBody />
      {isSearchInputActive && <SearchSuggestBody />}

      <ToastPopup />
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

const FavoriteTermButton = styled.div`
  display: flex;
  margin-right: 10px;
  cursor: pointer;
`;

export default SearchPostPage;
