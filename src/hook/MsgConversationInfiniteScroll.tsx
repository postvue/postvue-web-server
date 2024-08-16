import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import { getMsgConversationList } from '../services/message/getMsgConversationList';
import {
  cursorIdAtomByMsgConversation,
  msgConversationListAtom,
} from '../states/MessageAtom';

interface MsgConversationInfiniteScrollProps {
  targetUserId: string;
}

const MsgConversationInfiniteScroll: React.FC<
  MsgConversationInfiniteScrollProps
> = ({ targetUserId }) => {
  const [cursorId, setCursorId] = useRecoilState(cursorIdAtomByMsgConversation);

  const [ref, inView] = useInView();

  const [msgConversationList, setMsgConversationList] = useRecoilState(
    msgConversationListAtom,
  );

  const callback = () => {
    getMsgConversationList(cursorId, targetUserId)
      .then((res) => {
        if (res.msgConversationRspList.length > 0) {
          setMsgConversationList((prev) => [
            ...prev,
            ...res.msgConversationRspList,
          ]);
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

  return (
    <ScrollBottomContainer ref={ref}>
      <div>테스트</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default MsgConversationInfiniteScroll;
