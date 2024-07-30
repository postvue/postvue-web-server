interface Location {
  latitude: number;
  longitude: number;
}

interface PostContent {
  postContentType: string;
  content: string;
  ascSortNum: number;
}

export interface PostRsp {
  postId: number;
  userId: number;
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
