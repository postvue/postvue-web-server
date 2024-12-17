export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface PostContentInterface {
  postContentType: string;
  content: string;
  ascSortNum: number;
  previewImg: string;
  isUploaded: boolean;
}

export interface PostRsp {
  postId: string;
  userId: string;
  username: string;
  profilePath: string;
  location: Location;
  tags: string[];
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

export interface PostInfoRsp {
  postId: string;
  userId: string;
  location: Location;
  tags: string[];
  postContents: PostContentInterface[];
  postCategory: string;
  postBodyText: string;
  postTitle: string;
  postedAt: string;
  targetAudTypeId: number;
}

export interface MasonryPostRsp {
  postId: string;
  userId: string;
  postContent: string;
  postContentType: string;
  username: string;
  location: Location;
  previewImg: string;
}

export interface DeleteCommentRsp {
  postId: string;
  commentId: string;
  isDeleted: boolean;
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
  postCommentMsg: string;
  commentMediaType: string;
  commentMediaContent: string;
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
  userId: string;
  username: string;
  nickname: string;
  profilePath: string;
  isFollowed: boolean;
  isMe: boolean;
  isBlocked: boolean;
}

export interface PostCommentReq {
  postCommentMsg: string;
}

export interface CreatePostReportReq {
  postReportReason: string | null;
  postReportReasonType: string;
}

// export interface PostCommentRsp {
//   postCommentId: string;
//   commentUserId: string;
//   postCommentType: string;
//   postCommentContent: string;
//   isLiked: boolean;
//   likeCount: number;
//   commentCount: number;
//   username: string;
//   profilePath: string;
//   postedAt: string;
//   isReplyMsg: boolean;
//   replyTargetCommentId: string;
// }

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

export interface PostUploadContent {
  contentUrl: string;
  contentType: string;
  isLink: boolean;
  fileBlob: Blob | null;
  filename: string;
  isUploadedLink: boolean;
  sort: number;
}

export interface PostComposeUploadByResourceLinkReq {
  latitude?: number;
  longitude?: number;
  address: string;
  postContents: PostContentInterface[];
  tagList: string[];
  title: string;
  bodyText: string;
}

export interface SnsPostComposeCreateReqInterface {
  address: string;
  tagList: string[];
  title: string;
  bodyText: string;
  postContentLinkList: PostContentInterface[];
  targetAudienceValue: number;
}

export interface PostUploadContentSort {
  name: string;
  sort: number;
}
