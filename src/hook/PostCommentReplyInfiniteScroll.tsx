import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { getPostCommentReplies } from '../services/post/getPostCommentReplies';
import {
  cursorIdByPostCommentReplyThreadAtom,
  postCommentRepliesThreadHashMapAtom,
} from '../states/PostThreadAtom';

interface PostCommentInfiniteScrollProps {
  postId: string;
  commentId: string;
}

const PostCommentReplyInfiniteScroll: React.FC<
  PostCommentInfiniteScrollProps
> = ({ postId, commentId }) => {
  const [cursorNum, setCursorNum] = useRecoilState(
    cursorIdByPostCommentReplyThreadAtom,
  );

  const [ref, inView] = useInView();

  const [postCommentRepliesHashMap, setPostCommentRepliesHashMap] =
    useRecoilState(postCommentRepliesThreadHashMapAtom);

  const callback = () => {
    getPostCommentReplies(postId, commentId, cursorNum)
      .then((res) => {
        if (res.snsPostCommentRspList.length > 0) {
          const newCommentRepliesHashMap = new Map(postCommentRepliesHashMap);

          res.snsPostCommentRspList.forEach((postComment) => {
            newCommentRepliesHashMap.set(
              postComment.postCommentId,
              postComment,
            );
          });

          setPostCommentRepliesHashMap(newCommentRepliesHashMap);
        }

        setCursorNum(res.cursorId);
      })
      .catch((err) => {
        throw err;
      });
  };
  useEffect(() => {
    if (inView) {
      callback();
    }
  }, [inView]);

  useEffect(() => {
    return () => {
      setCursorNum(INIT_CURSOR_ID);
      setPostCommentRepliesHashMap(new Map());
    };
  }, []);

  return (
    <ScrollBottomContainer ref={ref}>
      <div>댓글 테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default PostCommentReplyInfiniteScroll;
