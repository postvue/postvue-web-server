import { Location } from './post';

export interface TargetProfileInfo {
  targetUserId: string;
  username: string;
  profilePath: string;
  msgRoomId: string;
}

export interface ProfileMyInfo {
  userId: string;
  username: string;
  profilePath: string;
}

export interface ProfileInfo {
  userId: string;
  username: string;
  profilePath: string;
  isMe: boolean;
  isFollowed: boolean;
}

export interface myPostScrapPreview {
  postThumbnailContent: string;
  postThumbnailContentType: string;
}
[];

export interface MyProfileScrapList {
  scrapId: string;
  scrapName: string;
  myPostScrapPreviewList: myPostScrapPreview[];
}

export interface MyProfileScrapInfo {
  scrapListId: string;
  scrapName: string;
}

export interface MyProfileClip {
  postId: string;
  location: Location;
  postThumbnailContent: string;
  postThumbnailContentType: string;
  userId: string;
  username: string;
  postedAt: string;
}

export interface MyProfileScrap {
  postId: string;
  location: Location;
  postThumbnailContent: string;
  postThumbnailContentType: string;
  userId: string;
  username: string;
  postedAt: string;
}

export interface TargetAudienceInterface {
  displayPhrase: string;
  targetAudienceValue: string;
}

export interface GetMyProfileScrapPreviewsRsp {
  scrapBoardId: string;
  isScraped: boolean;
  scrapBoardName: string;
}

export interface PostToScrapRsp {
  scrapId: string;
  isScraped: boolean;
  isClipped: boolean;
}

export interface PostToScrapListReq {
  scrapIdList: string[];
}

export interface PostToScrapListRsp {
  scrapIdList: string[];
  isClipped: boolean;
}
