import React from 'react';

import { queryClient } from 'App';

import { FAVORITE_TERM_ADD_BOOKMARK_TEXT } from 'const/SystemPhraseConst';
import styled from 'styled-components';

import { ReactComponent as SearchFavoriteButtonIcon } from 'assets/images/icon/svg/searchfavorite/SearchFavoriteButtonIcon.svg';
import { ReactComponent as SearchFavoriteNotActiveButtonIcon } from 'assets/images/icon/svg/searchfavorite/SearchFavoriteNotActiveButtonIcon.svg';
import { AxiosError } from 'axios';
import { notify } from 'components/popups/ToastMsgPopup';
import { SEARCH_FAVORITE_LIST_PATH } from 'const/PathConst';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { QUERY_STATE_SEARCH_POST_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import {
  sendVibrationLightEvent,
  stackRouterPush,
} from 'global/util/reactnative/nativeRouter';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { QueryMutationSearchFavoriteTermList } from 'hook/queryhook/QueryMutationSearchFavoriteTerm';
import { SearchPostQueryInterface } from 'hook/queryhook/QueryStateSearchPostListInfinite';
import { useNavigate } from 'react-router-dom';

interface SearchFavoriteTermButtonProps {
  searchQueryAndFilterKey?: string;
  searchWord: string;
  FavoriteTermButtonStyle?: React.CSSProperties;
  isFavoriteTerm: boolean;
}

const SearchFavoriteTermButton: React.FC<SearchFavoriteTermButtonProps> = ({
  searchQueryAndFilterKey = '',
  searchWord,
  FavoriteTermButtonStyle,
  isFavoriteTerm,
}) => {
  const putMutationSearchFavoriteTerm = QueryMutationSearchFavoriteTermList();

  const navigate = useNavigate();

  const onClickBookmarkFavorite = () => {
    const searchPostQueryPageList: SearchPostQueryInterface | undefined =
      queryClient.getQueryData([
        convertQueryTemplate(
          QUERY_STATE_SEARCH_POST_LIST,
          searchQueryAndFilterKey,
        ),
      ]);

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
      if (!isFavoriteTerm) {
        const randomSearchPost =
          searchPostList[Math.floor(Math.random() * searchPostList.length)];
        const randomPostContent =
          randomSearchPost.postContents[
            Math.floor(Math.random() * randomSearchPost.postContents.length)
          ];
        if (randomPostContent.postContentType === POST_VIDEO_TYPE) {
          favoriteTermContent = randomPostContent.previewImg;
          favoriteTermContentType = POST_IMAGE_TYPE;
        } else {
          favoriteTermContent = randomPostContent.content;
          favoriteTermContentType = POST_IMAGE_TYPE;
        }
      }
    }

    putMutationSearchFavoriteTerm
      .mutateAsync({
        isFavorite: !isFavoriteTerm,
        favoriteTerm: searchWord,
        favoriteTermContent: favoriteTermContent,
        favoriteTermContentType: favoriteTermContentType,
      })
      .then((value) => {
        if (value) {
          sendVibrationLightEvent();
          notify({
            msgIcon: <SearchFavoriteNotActiveButtonIcon />,
            msgTitle: FAVORITE_TERM_ADD_BOOKMARK_TEXT,
            rightNode: (
              <PostScrapNotificationGoButton
                onClick={() => {
                  stackRouterPush(navigate, SEARCH_FAVORITE_LIST_PATH);
                }}
              >
                보기
              </PostScrapNotificationGoButton>
            ),
            autoClose: 3500,
          });
        }
      })
      .catch((error: AxiosError) => {
        const data: any = error.response?.data;
        alert(data.message);
      });
  };

  return (
    <>
      <FavoriteTermButton
        onClick={(e) => {
          e.stopPropagation();
          onClickBookmarkFavorite();
        }}
        style={FavoriteTermButtonStyle}
      >
        {isFavoriteTerm ? (
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

const PostScrapNotificationGoButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  padding: 0 10px;
  cursor: pointer;
`;

export default SearchFavoriteTermButton;
