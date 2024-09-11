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
