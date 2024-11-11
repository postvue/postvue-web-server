import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import InViewComponent from 'components/common/container/InViewComponent';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { NavigationType, useNavigationType } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getProfilePostListByCursor } from '../services/profile/getProfilePostList';
import {
  cursorIdByProfilePostListAtom,
  profilePostHashMapAtom,
} from '../states/ProfileAtom';
import { systemPostRspHashMapAtom } from '../states/SystemConfigAtom';

interface ProfilePostListInfiniteScrollProps {
  username: string;
}

const ProfilePostListInfiniteScrollBeta: React.FC<
  ProfilePostListInfiniteScrollProps
> = ({ username }) => {
  const navigationType = useNavigationType();
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
    if (cursorNum === ZERO_CURSOR_ID) return;
    getProfilePostListByCursor(username, cursorNum)
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

  useEffect(() => {
    if (navigationType === NavigationType.Push) {
      setSnsPostHashMap(new Map());
      setCursorNum(INIT_CURSOR_ID);
    }
  }, [username]);

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default ProfilePostListInfiniteScrollBeta;
