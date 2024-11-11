import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import InViewComponent from 'components/common/container/InViewComponent';
import { useRecoilState } from 'recoil';
import { getTasteForMeListByParam } from '../services/post/home/getTasteForMeList';
import { systemPostRspHashMapAtom } from '../states/SystemConfigAtom';
import {
  cursorIdAtomByTasteForMe,
  pageNumAtomByTasteForMe,
  tasteForMeHashMapAtom,
} from '../states/TasteForMeAtom';

const TasteForMeInfiniteScroll: React.FC = () => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdAtomByTasteForMe);
  const [pageNum, setPageNum] = useRecoilState(pageNumAtomByTasteForMe);

  const [ref, inView] = useInView();

  const [snsPostHashMap, setSnsPostHashMap] = useRecoilState(
    tasteForMeHashMapAtom,
  );
  const [systemPostHashMap, setSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const callback = () => {
    getTasteForMeListByParam(cursorNum, pageNum)
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
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default TasteForMeInfiniteScroll;
