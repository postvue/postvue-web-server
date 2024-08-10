import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import { getPostComments } from '../services/post/getPostComments';
import {
  cursorIdAtomByPostReactionComment,
  postReactionCommentHashMapAtom,
} from '../states/PostReactionAtom';

interface PostCommentInfiniteScrollProps {
  postId: string;
}

const PostCommentInfiniteScroll: React.FC<PostCommentInfiniteScrollProps> = ({
  postId,
}) => {
  const [cursorNum, setCursorNum] = useRecoilState(
    cursorIdAtomByPostReactionComment,
  );

  const [ref, inView] = useInView();

  const [snsPostCommentHashMap, setSnsPostCommentHashMap] = useRecoilState(
    postReactionCommentHashMapAtom,
  );

  const callback = () => {
    getPostComments(postId, cursorNum)
      .then((res) => {
        if (res.snsPostCommentRspList.length > 0) {
          const newSnsPostCommentHashMap = new Map(snsPostCommentHashMap);

          res.snsPostCommentRspList.forEach((postComment) => {
            newSnsPostCommentHashMap.set(
              postComment.postCommentId,
              postComment,
            );
          });

          setSnsPostCommentHashMap(newSnsPostCommentHashMap);
        }

        setCursorNum(res.cursorId);
      })
      .catch((err) => {
        throw err;
      });
  };
  useEffect(() => {
    // categoryId가 변경되고 이전 categoryId와 다를 때에만 실행
    if (inView) {
      callback();
    }
  }, [inView]);

  return (
    <ScrollBottomContainer ref={ref}>
      <div>댓글 테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default PostCommentInfiniteScroll;
