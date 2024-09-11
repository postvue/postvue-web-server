interface postContentInfo {
  postId: string;
  postContentType: string;
  content: string;
}

export interface RecommFollowInfo {
  followId: string;
  profilePath: string;
  username: string;
  followerNum: number;
  followingNum: number;
  postPreviewImgUrlList: postContentInfo[];
}

export interface RecommTagInfo {
  tagId: string;
  tagName: string;
  tagBkgdPath: string;
}
