import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { PostProfileInfoRsp } from '../global/interface/post';

export const reactionPostIdAtom = atom<string>({
  key: 'reactionPostId',
  default: '',
});
export const isPostReactionAtom = atom<boolean>({
  key: 'isPostReaction',
  default: false,
});

// export const postReactionCommentHashMapAtom = atom<Map<string, PostComment>>({
//   key: 'postReactionCommentHashMap',
//   default: new Map(),
// });

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

export const likeIconRefObjectsAtom = atom<{
  [key: string]: SVGSVGElement | null;
}>({
  key: 'likeIconRefObjects',
  default: {},
});

export const likeCountRefObjectsAtom = atom<{
  [key: string]: HTMLDivElement | null;
}>({
  key: 'likeCountRefObjects',
  default: {},
});

export const commentCountRefObjectsAtom = atom<{
  [key: string]: HTMLDivElement | null;
}>({
  key: 'commentCountRefObjects',
  default: {},
});

export const postCommentTextareaRefAtom = atom<HTMLTextAreaElement | null>({
  key: 'postCommentTextareaRef',
  default: null,
});
