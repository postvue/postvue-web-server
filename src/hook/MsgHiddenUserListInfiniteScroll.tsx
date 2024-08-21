import React, { useEffect } from 'react';
import styled from 'styled-components';
// import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useInView } from 'react-intersection-observer';
// import CopyRightFooter from '../conponents/CopyRightFooter';

import { useRecoilState, useResetRecoilState } from 'recoil';
import { getHiddenUserList } from '../services/message/getHiddenUserList';
import {
  cursorIdByMsgHiddenUserAtom,
  msgHiddenUserHashMapAtom,
} from '../states/MessageAtom';

const MsgHiddenUserListInfiniteScroll: React.FC = () => {
  const [cursorId, setCursorId] = useRecoilState(cursorIdByMsgHiddenUserAtom);

  const [ref, inView] = useInView();

  const [msgHiddenUserHashMap, setMsgHiddenUserHashMap] = useRecoilState(
    msgHiddenUserHashMapAtom,
  );
  const resetMsgHiddenUserHashMap = useResetRecoilState(
    msgHiddenUserHashMapAtom,
  );
  const restCursorIdByMsgHiddenUser = useResetRecoilState(
    cursorIdByMsgHiddenUserAtom,
  );

  const callback = () => {
    getHiddenUserList(cursorId)
      .then((res) => {
        if (res.hiddenUserList.length > 0) {
          const newMsgHiddenUserHashMap = new Map(msgHiddenUserHashMap);
          res.hiddenUserList.forEach((msgHiddenUser) => {
            newMsgHiddenUserHashMap.set(
              msgHiddenUser.targetUserId,
              msgHiddenUser,
            );
          });

          setMsgHiddenUserHashMap(newMsgHiddenUserHashMap);

          setCursorId(res.cursorId);
        }
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
    return () => {
      resetMsgHiddenUserHashMap();
      restCursorIdByMsgHiddenUser();
    };
  }, []);

  return (
    <ScrollBottomContainer ref={ref}>
      <div>테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default MsgHiddenUserListInfiniteScroll;
