import React, { useEffect } from 'react';
import styled from 'styled-components';
// import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useInView } from 'react-intersection-observer';
// import CopyRightFooter from '../conponents/CopyRightFooter';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { getTasteForMeListByParam } from '../services/home/getTasteForMeList';
import {
  cursorIdAtomByTasteForMe,
  pageNumAtomByTasteForMe,
  tasteForMeListAtom,
} from '../states/TasteForMeAtom';

const TasteForMeInfiniteScroll: React.FC = () => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdAtomByTasteForMe);
  const [pageNum, setPageNum] = useRecoilState(pageNumAtomByTasteForMe);

  const [ref, inView] = useInView();

  const setSnsPostList = useSetRecoilState(tasteForMeListAtom);

  const callback = () => {
    console.log('커서:', cursorNum, '페이지 번호:', pageNum);
    getTasteForMeListByParam(cursorNum, pageNum)
      .then((res) => {
        if (res.snsPostRspList.length > 0) {
          setSnsPostList((prev) => [...prev, ...res.snsPostRspList]);
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
      <div>테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default TasteForMeInfiniteScroll;
