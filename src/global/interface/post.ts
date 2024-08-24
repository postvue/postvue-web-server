export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface PostContent {
  postContentType: string;
  content: string;
  ascSortNum: number;
}

export interface PostRsp {
  postId: string;
  userId: string;
  username: string;
  profilePath: string;
  location: Location;
  tags: string[];
  reactionCount: number;
  isFollowed: boolean;
  followable: boolean;
  isLiked: boolean;
  isClipped: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
  postContents: PostContent[];
  postCategory: string;
  postedAt: string;
}

export interface MasonryPostRsp {
  postId: string;
  userId: string;
  postContent: string;
  username: string;
  location: Location;
}

export interface PostLikeRsp {
  isLike: boolean;
}

export interface PostClipRsp {
  isClipped: boolean;
}

export interface PostComment {
  postCommentId: string;
  commentUserId: string;
  postCommentType: string;
  postCommentContent: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  username: string;
  profilePath: string;
  postedAt: string;
}

export interface PostProfileInfoRsp {
  useId: string;
  username: string;
  nickname: string;
  profilePath: string;
  isFollowed: boolean;
  isMe: boolean;
}
