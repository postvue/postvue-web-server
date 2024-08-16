import { Location } from './post';

export interface FollowProfileInfo {
  followUserId: string;
  username: string;
  profilePath: string;
  msgSessionId: string;
}

export interface MyProfileInfo {
  myUserId: string;
  username: string;
  profilePath: string;
}

export interface MyProfileScrapList {
  scrapId: string;
  scrapName: string;
  postImagePathList: string[];
}

export interface MyProfileScrapInfo {
  scrapListId: string;
  scrapName: string;
}

export interface MyProfileClip {
  postId: string;
  location: Location;
  postThumbnailImagePath: string;
  userId: string;
  username: string;
  postedAt: string;
}

export interface MyProfileScrap {
  postId: string;
  location: Location;
  postThumbnailImagePath: string;
  userId: string;
  username: string;
  postedAt: string;
}

export interface TargetAudienceInterface {
  displayPhrase: string;
  targetAudienceValue: string;
}
