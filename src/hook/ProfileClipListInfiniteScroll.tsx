import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { useRecoilState } from 'recoil';
import { getMyProfileClipList } from '../services/profile/getMyProfileClipList';
import {
  cursorIdByClipListAtom,
  myProfileClipHashMapAtom,
} from '../states/ProfileAtom';

const ProfileClipListInfiniteScroll: React.FC = () => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdByClipListAtom);

  const [ref, inView] = useInView();

  const [myProfileClipHashMap, setMyProfileClipHashMap] = useRecoilState(
    myProfileClipHashMapAtom,
  );

  const callback = () => {
    if (cursorNum === ZERO_CURSOR_ID) return;
    getMyProfileClipList(cursorNum)
      .then((res) => {
        if (res.myClipRspList.length > 0) {
          const tempMyProfileClipHashMap = new Map(myProfileClipHashMap);
          res.myClipRspList.forEach((myClipRsp) => {
            tempMyProfileClipHashMap.set(myClipRsp.postId, myClipRsp);
          });
          setMyProfileClipHashMap(tempMyProfileClipHashMap);
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
