import { PostRsp } from 'global/interface/post';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { systemPostRspHashMapAtom } from 'states/SystemConfigAtom';

interface SystemSnsPostStateProps {
  postRsp: PostRsp;
}

const SystemSnsPostState: React.FC<SystemSnsPostStateProps> = ({ postRsp }) => {
  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );
  useEffect(() => {
    const newSnsPostHashMap = new Map(snsSystemPostHashMap);
    newSnsPostHashMap.set(postRsp.postId, postRsp);
    setSnsSystemPostHashMap(newSnsPostHashMap);
  }, [postRsp]);
  return <></>;
};

export default SystemSnsPostState;
