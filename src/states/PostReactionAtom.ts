import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { PostComment, PostProfileInfoRsp } from '../global/interface/post';

export const reactionPostIdAtom = atom<string>({
  key: 'reactionPostId',
  default: '',
});
export const isPostReactionAtom = atom<boolean>({
  key: 'isPostReaction',
  default: false,
});

export const postReactionCommentHashMapAtom = atom<Map<string, PostComment>>({
  key: 'postReactionCommentHashMap',
  default: new Map(),
});

export const cursorIdAtomByPostReactionComment = atom<string>({
  key: 'cursorIdByPostReactionComment',
  default: INIT_CURSOR_ID,
});

export const postReactionRepostHashMapAtom = atom<
  Map<string, PostProfileInfoRsp>
>({
  key: 'postReactionRepostHashMap',
  default: new Map(),
});

export const cursorIdAtomByPostReactionRepost = atom<string>({
  key: 'cursorIdByPostReactionRepost',
  default: INIT_CURSOR_ID,
});

export const postReactionLikeHashMapAtom = atom<
  Map<string, PostProfileInfoRsp>
>({
  key: 'postReactionLikeHashMap',
  default: new Map(),
});

export const cursorIdAtomByPostReactionLike = atom<string>({
  key: 'cursorIdByPostReactionLike',
  default: INIT_CURSOR_ID,
});
