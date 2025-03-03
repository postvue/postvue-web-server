import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import InViewComponent from 'components/common/container/InViewComponent';
import { useRecoilState } from 'recoil';
import { getFollowForMeListByParam } from '../services/post/home/getFollowForMeList';
import {
  cursorIdAtomByFollowForMe,
  followForMeHashMapAtom,
  pageNumAtomByFollowForMe,
} from '../states/FollowForMeAtom';

const FollowForMeInfiniteScroll: React.FC = () => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdAtomByFollowForMe);
  const [pageNum, setPageNum] = useRecoilState(pageNumAtomByFollowForMe);

  const [ref, inView] = useInView();

  const [snsPostHashMap, setSnsPostHashMap] = useRecoilState(
    followForMeHashMapAtom,
  );

  const callback = () => {
    getFollowForMeListByParam(cursorNum)
      .then((res) => {
        if (res.snsPostRspList.length > 0) {
          const newSnsPostHashMap = new Map(snsPostHashMap);
          res.snsPostRspList.forEach((post) => {
            newSnsPostHashMap.set(post.postId, post);
          });

          setSnsPostHashMap(newSnsPostHashMap);
          setPageNum(pageNum + 1);
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
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default FollowForMeInfiniteScroll;
