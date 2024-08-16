import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { MyProfileScrapInfo } from '../global/interface/profile';
import { getMyProfileScrap } from '../services/profile/getMyProfileScrap';
import { cursorIdByScrapAtom, myProfileScrapAtom } from '../states/ProfileAtom';

interface ProfileScarpInfiniteScrollProps {
  scrapId: string;
  withScrapInfo?: boolean;
  setProfileScrapInfo?: React.Dispatch<
    React.SetStateAction<MyProfileScrapInfo>
  >;
}

const ProfileScarpInfiniteScroll: React.FC<ProfileScarpInfiniteScrollProps> = ({
  scrapId,
  setProfileScrapInfo,
  withScrapInfo,
}) => {
  const [cursorNum, setCursorNum] = useRecoilState(cursorIdByScrapAtom);
  const [ref, inView] = useInView();
  const setMyProfileScrap = useSetRecoilState(myProfileScrapAtom);

  const resetCursorNum = useResetRecoilState(cursorIdByScrapAtom);
  const resetMyProfileScrap = useResetRecoilState(myProfileScrapAtom);

  const callback = () => {
    if (withScrapInfo) {
      getMyProfileScrap(cursorNum, scrapId, withScrapInfo)
        .then((res) => {
          if (res.myScrapPostList.length > 0) {
            setMyProfileScrap((prev) => [...prev, ...res.myScrapPostList]);
          }

          if (setProfileScrapInfo !== undefined) {
            setProfileScrapInfo({
              scrapListId: res.scrapId,
              scrapName: res.scrapName,
            });
          }

          setCursorNum(res.cursorId);
        })
        .catch((err) => {
          throw err;
        });
    } else {
      getMyProfileScrap(cursorNum, scrapId)
        .then((res) => {
          if (res.myScrapPostList.length > 0) {
            setMyProfileScrap((prev) => [...prev, ...res.myScrapPostList]);
          }

          setCursorNum(res.cursorId);
        })
        .catch((err) => {
          throw err;
        });
    }
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

export default ProfileScarpInfiniteScroll;
