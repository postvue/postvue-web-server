import { atom } from 'recoil';
import { PostRsp } from '../global/interface/post';

export const postRspAtom = atom<PostRsp>({
  key: 'postRsp',
  default: {
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
    postedAt: '',
  },
});
