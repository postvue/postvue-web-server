import { POST_REACTION_COMMENT_ID } from 'const/TabConfigConst';
import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';

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

export const postReactionTabIdAtom = atom<number>({
  key: 'postReactionTabId',
  default: POST_REACTION_COMMENT_ID,
});

export const isFocusPostReactionInputAtom = atom<boolean>({
  key: 'isFocusPostReactionInput',
  default: false,
});
