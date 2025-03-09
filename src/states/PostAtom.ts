import { POST_RELATION_SEARCH_TYPE } from 'const/PostConst';
import { atom } from 'recoil';
import { PostContentInterface, PostRsp } from '../global/interface/post';

export const PostRspDefaultValue = {
  postId: '',
  userId: '',
  username: '',
  profilePath: '',
  location: { latitude: 0, longitude: 0, address: '', buildName: '' },
  tags: [],
  reactionCount: 0,
  isFollowed: false,
  followable: false,
  isLiked: false,
  isClipped: false,
  isReposted: false,
  isBookmarked: false,
  postContents: [],
  postCategory: '',
  postBodyText: '',
  postTitle: '',
  postedAt: '',
};

export const postRspAtom = atom<PostRsp>({
  key: 'postRsp',
  default: PostRspDefaultValue,
});

export const isExternalClosePostDetailPopupAtom = atom<boolean>({
  key: 'isExternalClosePostDetailPopup',
  default: false,
});

export const postContentZoomPopupInfoAtom = atom<{
  isActive: boolean;
  initIndex: number;
  postContents: PostContentInterface[];
}>({
  key: 'postContentZoomPopupInfo',
  default: {
    isActive: false,
    initIndex: 0,
    postContents: [],
  },
});

export const isPostDetailInfoPopupAtom = atom<boolean>({
  key: 'isPostDetailInfoPopup',
  default: false,
});

export const postDetailInfoPopupAtom = atom<{
  postId: string;
  userId: string;
  searchType?: POST_RELATION_SEARCH_TYPE;
}>({
  key: 'postDetailInfo',
  default: {
    postId: '',
    userId: '',
    searchType: undefined,
  },
});

export const isFixScrollToPostDetailPopupAtom = atom<boolean>({
  key: 'isFixScrollToPostDetailPopup',
  default: false,
});

export const activePostComplaintPopupAtom = atom<{
  isActive: boolean;
  userId: string;
  username: string;
}>({
  key: 'isActivePostComplaintPopup',
  default: {
    isActive: false,
    userId: '',
    username: '',
  },
});

export const activePostCommentComplaintPopupAtom = atom<{
  isActive: boolean;
  postId: string;
  userId: string;
  username: string;
  commentId: string;
}>({
  key: 'activePostCommentComplaintPopup',
  default: {
    isActive: false,
    postId: '',
    userId: '',
    username: '',
    commentId: '',
  },
});

export const activePostComplaintCompletePopupAtom = atom<{
  isActive: boolean;
  userId: string;
  username: string;
}>({
  key: 'activePostComplaintCompletePopup',
  default: {
    isActive: false,
    userId: '',
    username: '',
  },
});

export const isActivePostDeletePopupAtom = atom<boolean>({
  key: 'isActivePostDeletePopup',
  default: false,
});

// export const postBlockedUserInfoAtom = atom<{
//   userId: string;
//   username: string;
// }>({
//   key: 'blockedUserInfo',
//   default: { userId: '', username: '' },
// });

export const isSettingPopupAtom = atom<boolean>({
  key: 'isSettingPopup',
  default: false,
});

export const activePostDotSettingInfoAtom = atom<{
  isActive: boolean;
  selectedPost: PostRsp | null;
  deletePostByScrapId: string | undefined;
}>({
  key: 'activePostDotSettingInfo',
  default: {
    isActive: false,
    selectedPost: null,
    deletePostByScrapId: undefined,
  },
});

export const isActiveDeleteClipByScrapPopupAtom = atom<boolean>({
  key: 'isActiveDeleteClipByScrapPopup',
  default: false,
});

export const postExternelEventInfoAtom = atom<{
  isActiveSideScroll: boolean;
  isClosePost: boolean;
}>({
  key: 'postVideoProcessInfo',
  default: {
    isActiveSideScroll: false,
    isClosePost: false,
  },
});

export const activeMakeScrapPopupInfoAtom = atom<{
  isActive: boolean;
  postId: string;
  postContentUrl: string;
  postContentType: string;
}>({
  key: 'activeMakeScrapPopupInfo',
  default: {
    isActive: false,
    postId: '',
    postContentType: '',
    postContentUrl: '',
  },
});

export const commentSettingPopupInfoAtom = atom<{
  isActive: boolean;
  postId: string;
  userId: string;
  username: string;
  commentId: string;
}>({
  key: 'commentSettingPopupInfo',
  default: {
    isActive: false,
    postId: '',
    userId: '',
    username: '',
    commentId: '',
  },
});
