import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { getMyProfileClipList } from '../services/profile/getMyProfileClipList';
import {
  cursorIdByClipListAtom,
  myProfileClipListAtom,
} from '../states/ProfileAtom';

const ProfileClipListInfiniteScroll: React.FC = () => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdByClipListAtom);

  const [ref, inView] = useInView();

  const setMyProfileClipList = useSetRecoilState(myProfileClipListAtom);

  const callback = () => {
    getMyProfileClipList(cursorNum)
      .then((res) => {
        if (res.myClipRspList.length > 0) {
          setMyProfileClipList((prev) => [...prev, ...res.myClipRspList]);
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
      <div>클립 테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default ProfileClipListInfiniteScroll;
