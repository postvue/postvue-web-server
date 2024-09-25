export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface PostContentInterface {
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
  postContents: PostContentInterface[];
  postCategory: string;
  postBodyText: string;
  postTitle: string;
  postedAt: string;
}

export interface MasonryPostRsp {
  postId: string;
  userId: string;
  postContent: string;
  postContentType: string;
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
  isReplyMsg: boolean;
  replyTargetCommentId: string;
}

export interface PostProfileInfoRsp {
  useId: string;
  username: string;
  nickname: string;
  profilePath: string;
  isFollowed: boolean;
  isMe: boolean;
  isBlocked: boolean;
}

export interface PostCommentReq {
  postCommentType: string;
  postCommentContent: string;
}

export interface PostCommentRsp {
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
  isReplyMsg: boolean;
  replyTargetCommentId: string;
}

export interface PostInterested {
  postId: string;
  isInterested: boolean;
}

export interface PostCommentReplyMsgInfo {
  username: string;
  profilePath: string;
  userId: string;
  commentId: string;
}

export interface PostCommentWithReplies extends PostComment {
  replies: PostCommentWithReplies[];
}

export interface PostDocResourceImageRsp {
  contentUrl: string;
  contentType: string;
}

export interface PostComposeUploadResource {
  contentUrl: string;
  contentType: string;
}

export interface PostComposeUploadByResourceLinkReq {
  latitude: number;
  longitude: number;
  postContents: PostContentInterface[];
  tagList: string[];
  title: string;
  bodyText: string;
}
