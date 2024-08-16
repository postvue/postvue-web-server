import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { getMyProfileScrapList } from '../services/profile/getMyProfileScrapList';
import {
  cursorIdByScrapListAtom,
  myProfileScrapListAtom,
} from '../states/ProfileAtom';

const ProfileScrapListInfiniteScroll: React.FC = () => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdByScrapListAtom);

  const [ref, inView] = useInView();

  const setMyProfileScrapList = useSetRecoilState(myProfileScrapListAtom);

  const callback = () => {
    getMyProfileScrapList(cursorNum)
      .then((res) => {
        if (res.myScrapLists.length > 0) {
          setMyProfileScrapList((prev) => [...prev, ...res.myScrapLists]);
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
      <div>스크랩 테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default ProfileScrapListInfiniteScroll;
