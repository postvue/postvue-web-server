import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import { getRecommPostRelation } from '../services/recomm/getRecommPostRelation';
import {
  cursorIdByPostRelationAtom,
  postRelationHashMapAtom,
} from '../states/PostRelation';

interface PostCommentInfiniteScrollProps {
  postId: string;
}

const PostRelationInfiniteScroll: React.FC<PostCommentInfiniteScrollProps> = ({
  postId,
}) => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdByPostRelationAtom);

  const [ref, inView] = useInView();

  const [snsPostRelationHashMap, setSnsPostRelationHashMap] = useRecoilState(
    postRelationHashMapAtom,
  );

  const callback = () => {
    getRecommPostRelation(postId, cursorNum)
      .then((res) => {
        if (res.snsPostRspList.length > 0) {
          const newSnsPostRelationHashMap = new Map(snsPostRelationHashMap);

          res.snsPostRspList.forEach((postRelation) => {
            newSnsPostRelationHashMap.set(postRelation.postId, postRelation);
          });

          setSnsPostRelationHashMap(newSnsPostRelationHashMap);
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

  return (
    <ScrollBottomContainer ref={ref}>
      <div>댓글 테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default PostRelationInfiniteScroll;
