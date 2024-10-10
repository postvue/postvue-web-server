import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import { getFollowForMeListByParam } from '../services/post/home/getFollowForMeList';
import {
  cursorIdAtomByFollowForMe,
  followForMeHashMapAtom,
  pageNumAtomByFollowForMe,
} from '../states/FollowForMeAtom';
import { systemPostRspHashMapAtom } from '../states/SystemConfigAtom';

const FollowForMeInfiniteScroll: React.FC = () => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdAtomByFollowForMe);
  const [pageNum, setPageNum] = useRecoilState(pageNumAtomByFollowForMe);

  const [ref, inView] = useInView();

  const [snsPostHashMap, setSnsPostHashMap] = useRecoilState(
    followForMeHashMapAtom,
  );
  const [systemPostHashMap, setSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const callback = () => {
    getFollowForMeListByParam(cursorNum)
      .then((res) => {
        if (res.snsPostRspList.length > 0) {
          const newSnsPostHashMap = new Map(snsPostHashMap);
          const newSystemPostHashMap = new Map(systemPostHashMap);
          res.snsPostRspList.forEach((post) => {
            newSnsPostHashMap.set(post.postId, post);
            newSystemPostHashMap.set(post.postId, post);
          });

          setSnsPostHashMap(newSnsPostHashMap);
          setSystemPostHashMap(newSystemPostHashMap);
          setPageNum(pageNum + 1);
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
      <div>팔로우 테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default FollowForMeInfiniteScroll;
