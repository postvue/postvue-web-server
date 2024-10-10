import { Location } from './post';

export interface ProfileInfoByDirectMsg {
  targetUserId: string;
  username: string;
  profilePath: string;
}

export interface ProfileMyInfo {
  userId: string;
  username: string;
  profilePath: string;
  nickname: string;
  website: string;
  introduce: string;
  email: string;
  birthdate: string;
  gender: string;
  isPrivateProfile: boolean;
}

export interface ProfileInfo {
  userId: string;
  nickname: string;
  username: string;
  introduce: string;
  profilePath: string;
  website: string;
  isMe: boolean;
  isFollowed: boolean;
  isBlocked: boolean;
  followerNum: number;
  followingNum: number;
}

export interface myPostScrapPreview {
  postThumbnailContent: string;
  postThumbnailContentType: string;
}
[];

export interface ProfileScrapList {
  scrapId: string;
  scrapName: string;
  myPostScrapPreviewList: myPostScrapPreview[];
  scrapNum: number;
  lastPostedAt: string;
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

export interface ProfileAccessToken {
  accessToken: string;
}

export interface ProfileBlockedUserRsp {
  blockedUserId: string;
  blockedUserName: string;
  blockedUserProfilePath: string;
}
