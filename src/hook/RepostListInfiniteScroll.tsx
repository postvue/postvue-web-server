import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import InViewComponent from 'components/common/container/InViewComponent';
import { useRecoilState } from 'recoil';
import { getRePostList } from '../services/post/getRepostList';
import {
  cursorIdAtomByPostReactionRepost,
  postReactionRepostHashMapAtom,
} from '../states/PostReactionAtom';

interface RepostInfiniteScrollProps {
  postId: string;
}

const RepostListInfiniteScroll: React.FC<RepostInfiniteScrollProps> = ({
  postId,
}) => {
  const [cursorNum, setCursorNum] = useRecoilState(
    cursorIdAtomByPostReactionRepost,
  );

  const [ref, inView] = useInView();

  const [snsRepostHashMap, setRepostHashMap] = useRecoilState(
    postReactionRepostHashMapAtom,
  );

  const callback = () => {
    getRePostList(postId, cursorNum)
      .then((res) => {
        if (res.snsReactionRepostedRspList.length > 0) {
          const newRepostHashMap = new Map(snsRepostHashMap);

          res.snsReactionRepostedRspList.forEach((repost) => {
            newRepostHashMap.set(repost.userId, repost);
          });

          setRepostHashMap(newRepostHashMap);
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
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default RepostListInfiniteScroll;
