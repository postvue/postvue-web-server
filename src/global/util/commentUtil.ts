import anime from 'animejs';
import { PostComment, PostCommentWithReplies } from '../interface/post';

export function getGroupComments(
  commentsMap: Map<string, PostComment>,
): Map<string, PostCommentWithReplies> {
  const commentMap = new Map<string, PostCommentWithReplies>();
  const repliesMap = new Map<string, PostCommentWithReplies[]>();

  // 댓글을 맵에 추가
  commentsMap.forEach((comment) => {
    commentMap.set(comment.postCommentId, { ...comment, replies: [] }); // replies 필드 추가
    if (!repliesMap.has(comment.postCommentId)) {
      repliesMap.set(comment.postCommentId, []);
    }
  });

  // 댓글과 답글을 연결
  commentsMap.forEach((comment) => {
    if (comment.replyTargetCommentId) {
      const parentReplies = repliesMap.get(comment.replyTargetCommentId) || [];
      const childReply = commentMap.get(comment.postCommentId);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parentReplies.push(childReply!);
      repliesMap.set(comment.replyTargetCommentId, parentReplies);
    }
  });

  // 최상위 댓글만 필터링 (sourceTargetId가 null인 경우)
  const topLevelComments = Array.from(commentMap.entries())
    .filter(([_, comment]) => comment.isReplyMsg === false)
    .sort(([idA], [idB]) => idB.localeCompare(idA)); // 내림차순으로 정렬

  // 결과를 저장할 맵
  const sortedGroupedComments = new Map<string, PostCommentWithReplies>();

  // 최상위 댓글부터 시작하여 자식 댓글을 재귀적으로 추가
  function buildTree(commentId: string): PostCommentWithReplies | null {
    const comment = commentMap.get(commentId);
    if (!comment) return null;
    const replies = repliesMap.get(commentId) || [];
    const sortedReplies = replies.sort((a, b) =>
      a.postCommentId.localeCompare(b.postCommentId),
    ); // 내림차순 정렬
    return {
      ...comment,
      replies: sortedReplies
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((reply) => buildTree(reply.postCommentId)!)
        .filter((reply) => reply !== null),
    };
  }

  topLevelComments.forEach(([id]) => {
    const tree = buildTree(id);
    if (tree) {
      sortedGroupedComments.set(id, tree);
    }
  });

  return sortedGroupedComments;
}

export const animateCount = (
  index: string,
  to: number,
  direction: 'up' | 'down',
  countRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>,
): void => {
  const countRefCurrent = countRef.current[index];
  if (countRefCurrent !== null) {
    anime({
      targets: countRefCurrent,
      translateY: direction === 'up' ? [20, 0] : [-20, 0],
      opacity: [0, 1],
      duration: 300,
      easing: 'easeInOutQuad',
      begin: () => {
        countRefCurrent.textContent = to.toString();
      },
    });
  }
};
