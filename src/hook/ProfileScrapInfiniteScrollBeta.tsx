import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { getProfileScrap } from '../services/profile/getProfileScrap';
import { cursorIdByScrapAtom, myProfileScrapAtom } from '../states/ProfileAtom';

interface ProfileScarpInfiniteScrollProps {
  scrapId: string;
}

const ProfileScarpInfiniteScrollBeta: React.FC<
  ProfileScarpInfiniteScrollProps
> = ({ scrapId }) => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdByScrapAtom);
  const [ref, inView] = useInView();
  const setMyProfileScrap = useSetRecoilState(myProfileScrapAtom);

  const resetCursorNum = useResetRecoilState(cursorIdByScrapAtom);
  const resetMyProfileScrap = useResetRecoilState(myProfileScrapAtom);

  const callback = () => {
    getProfileScrap(cursorNum, scrapId)
      .then((res) => {
        if (res.myScrapPostList.length > 0) {
          setMyProfileScrap((prev) => [...prev, ...res.myScrapPostList]);
        }

        setCursorNum(res.cursorId);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    return () => {
      resetCursorNum();
      resetMyProfileScrap();
    };
  }, []);

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

export default ProfileScarpInfiniteScrollBeta;
