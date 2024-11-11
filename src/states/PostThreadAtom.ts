import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';

// export const postCommentRepliesThreadHashMapAtom = atom<
//   Map<string, PostComment>
// >({
//   key: 'postCommentRepliesThreadHashMap',
//   default: new Map(),
// });

export const activeCommentByPostCommentThreadAtom = atom<{
  postId: string;
  commentId: string;

  username: string;
  userId: string;
  isActive: boolean;
}>({
  key: 'activeCommentByPostCommentThread',
  default: {
    postId: '',
    commentId: '',
    username: '',
    userId: '',
    isActive: false,
  },
});

export const cursorIdByPostCommentReplyThreadAtom = atom<string>({
  key: 'cursorIdByPostCommentReplyThread',
  default: INIT_CURSOR_ID,
});
