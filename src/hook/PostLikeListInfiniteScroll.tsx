import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import InViewComponent from 'components/common/container/InViewComponent';
import { useRecoilState } from 'recoil';
import { getPostLikeList } from '../services/post/getPostLiketList';
import {
  cursorIdAtomByPostReactionLike,
  postReactionLikeHashMapAtom,
} from '../states/PostReactionAtom';

interface RepostInfiniteScrollProps {
  postId: string;
}

const PostLikeListInfiniteScroll: React.FC<RepostInfiniteScrollProps> = ({
  postId,
}) => {
  const [cursorNum, setCursorNum] = useRecoilState(
    cursorIdAtomByPostReactionLike,
  );

  const [ref, inView] = useInView();

  const [snsPostLikeHashMap, setPostLikeHashMap] = useRecoilState(
    postReactionLikeHashMapAtom,
  );

  const callback = () => {
    getPostLikeList(postId, cursorNum)
      .then((res) => {
        if (res.snsPostLikeGetRspList.length > 0) {
          const newRepostHashMap = new Map(snsPostLikeHashMap);

          res.snsPostLikeGetRspList.forEach((postLike) => {
            newRepostHashMap.set(postLike.userId, postLike);
          });

          setPostLikeHashMap(newRepostHashMap);
        }
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
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default PostLikeListInfiniteScroll;
