import React, { useEffect } from 'react';
import styled from 'styled-components';
// import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useInView } from 'react-intersection-observer';
// import CopyRightFooter from '../conponents/CopyRightFooter';

import { useRecoilState } from 'recoil';
import { getPostSearch } from '../services/post/getPostSearch';
import {
  cursorIdAtomBySearchPost,
  searchPostHashMapAtom,
} from '../states/SearchPostAtom';

interface RepostInfiniteScrollProps {
  searchWord: string;
}

const SearchPostListInfiniteScroll: React.FC<RepostInfiniteScrollProps> = ({
  searchWord,
}) => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdAtomBySearchPost);

  const [ref, inView] = useInView();

  const [searchPostHashMap, setSearchPostHashMap] = useRecoilState(
    searchPostHashMapAtom,
  );

  const callback = () => {
    getPostSearch(searchWord, cursorNum)
      .then((res) => {
        if (res.snsPostRspList.length > 0) {
          const newRepostHashMap = new Map(searchPostHashMap);

          res.snsPostRspList.forEach((snsPost) => {
            newRepostHashMap.set(snsPost.postId, snsPost);
          });

          setSearchPostHashMap(newRepostHashMap);
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
  }, [inView, searchWord]);

  return (
    <ScrollBottomContainer ref={ref}>
      <div>검색 포스트 테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default SearchPostListInfiniteScroll;
