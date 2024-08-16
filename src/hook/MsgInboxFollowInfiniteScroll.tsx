import React, { useEffect } from 'react';
import styled from 'styled-components';
// import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useInView } from 'react-intersection-observer';
// import CopyRightFooter from '../conponents/CopyRightFooter';

import { useRecoilState, useResetRecoilState } from 'recoil';
import { getMsgInboxMessages } from '../services/message/getMsgInboxMessages';
import {
  msgInboxMessageHashMapAtom,
  pageNumAtomByMsgInboxMessage,
} from '../states/MessageAtom';

const MsgInboxFollowInfiniteScroll: React.FC = () => {
  const [pageNum, setPageNum] = useRecoilState(pageNumAtomByMsgInboxMessage);

  const [ref, inView] = useInView();

  const [msgInboxMessageHashMap, setMsgInboxMessageHashMap] = useRecoilState(
    msgInboxMessageHashMapAtom,
  );
  const resetMsgInboxMessageHashMap = useResetRecoilState(
    msgInboxMessageHashMapAtom,
  );
  const restPageNumByMsgInbox = useResetRecoilState(
    pageNumAtomByMsgInboxMessage,
  );

  const callback = () => {
    getMsgInboxMessages(pageNum)
      .then((res) => {
        if (res.length > 0) {
          const newMsgInboxMessageHashMap = new Map(msgInboxMessageHashMap);
          res.forEach((msgInbxMessage) => {
            newMsgInboxMessageHashMap.set(
              msgInbxMessage.username,
              msgInbxMessage,
            );
          });

          setMsgInboxMessageHashMap(newMsgInboxMessageHashMap);

          setPageNum(pageNum + 1);
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
      resetMsgInboxMessageHashMap();
      restPageNumByMsgInbox();
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

export default MsgInboxFollowInfiniteScroll;
