import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import { getProfilePostListByCursor } from '../services/profile/getProfilePostList';
import {
  cursorIdByProfilePostListAtom,
  profilePostHashMapAtom,
} from '../states/ProfileAtom';
import { systemPostRspHashMapAtom } from '../states/SystemConfigAtom';

const ProfilePostListInfiniteScroll: React.FC = () => {
  const [cursorNum, setCursorNum] = useRecoilState(
    cursorIdByProfilePostListAtom,
  );

  const [ref, inView] = useInView();

  const [snsPostHashMap, setSnsPostHashMap] = useRecoilState(
    profilePostHashMapAtom,
  );
  const [systemPostHashMap, setSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const callback = () => {
    getProfilePostListByCursor(cursorNum)
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
      <div>테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default ProfilePostListInfiniteScroll;
