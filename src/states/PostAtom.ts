import { atom } from 'recoil';
import { PostRsp } from '../global/interface/post';

export const PostRspDefaultValue = {
  postId: '',
  userId: '',
  username: '',
  profilePath: '',
  location: { latitude: 0, longitude: 0, address: '' },
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

export const postContentZoomPopupInfoAtom = atom<{
  isActive: boolean;
  initIndex: number;
}>({
  key: 'postContentZoomPopupInfo',
  default: {
    isActive: false,
    initIndex: 0,
  },
});

export const isPostDetailInfoPopupAtom = atom<boolean>({
  key: 'isPostDetailInfoPopup',
  default: false,
});

export const postDetailInfoPopupAtom = atom<{
  postId: string;
  userId: string;
}>({
  key: 'postDetailInfo',
  default: {
    postId: '',
    userId: '',
  },
});

export const isActivePostComplaintPopupAtom = atom<boolean>({
  key: 'isActivePostComplaintPopup',
  default: false,
});

export const isActivePostComplaintCompletePopupAtom = atom<boolean>({
  key: 'isActivePostComplaintCompletePopup',
  default: false,
});

export const postBlockedUserInfoAtom = atom<{
  userId: string;
  username: string;
}>({
  key: 'blockedUserInfo',
  default: { userId: '', username: '' },
});
