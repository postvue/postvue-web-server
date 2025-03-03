import { PostRsp } from './post';

export interface PutFavoriteSearchTermReq {
  isFavorite: boolean;
  favoriteTerm: string;
  favoriteTermContent: string;
  favoriteTermContentType: string;
}

export interface GetFavoriteTermRsp {
  favoriteTermName: string;
  favoriteTermContent: string;
  favoriteTermContentType: string;
  isFavorite: boolean;
}

export interface GetSearchTermRsp {
  favoriteTermName: string;
  favoriteTermContent: string;
  favoriteTermContentType: string;
  isTag: boolean;
  isFavoriteTerm: boolean;
  isFollowTag: boolean;
  isExistTag: boolean;
}

export interface SearchPostResultInfoInterface {
  position: number;
  savedTime: Date; //mincro time
  retentionMinutes: number;
}

export interface GetSearchPostsRsp {
  snsPostRspList: PostRsp[];
  isBookMarkedFavoriteTerm: boolean;
  isFetchFavoriteState: boolean;
}
