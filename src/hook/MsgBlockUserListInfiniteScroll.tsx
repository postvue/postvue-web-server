import React, { useEffect } from 'react';
import styled from 'styled-components';
// import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useInView } from 'react-intersection-observer';
// import CopyRightFooter from '../conponents/CopyRightFooter';

import InViewComponent from 'components/common/container/InViewComponent';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { getMsgBlockedUserList } from '../services/message/getMsgBlockedUserList';
import {
  cursorIdByMsgBlockUserAtom,
  msgBlockUserHashMapAtom,
} from '../states/MessageAtom';

const MsgBlockUserListInfiniteScroll: React.FC = () => {
  const [cursorId, setCursorId] = useRecoilState(cursorIdByMsgBlockUserAtom);

  const [ref, inView] = useInView();

  const [msgBlockUserHashMap, setMsgBlockUserHashMap] = useRecoilState(
    msgBlockUserHashMapAtom,
  );
  const resetMsgBlockUserHashMap = useResetRecoilState(msgBlockUserHashMapAtom);
  const restCursorIdByMsgBlockUser = useResetRecoilState(
    cursorIdByMsgBlockUserAtom,
  );

  const callback = () => {
    getMsgBlockedUserList(cursorId)
      .then((res) => {
        if (res.blockUserList.length > 0) {
          const newMsgBlockUserHashMap = new Map(msgBlockUserHashMap);
          res.blockUserList.forEach((msgBlockUser) => {
            newMsgBlockUserHashMap.set(msgBlockUser.targetUserId, msgBlockUser);
          });

          setMsgBlockUserHashMap(newMsgBlockUserHashMap);

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
      resetMsgBlockUserHashMap();
      restCursorIdByMsgBlockUser();
    };
  }, []);

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default MsgBlockUserListInfiniteScroll;
