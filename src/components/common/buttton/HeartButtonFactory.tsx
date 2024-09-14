import React from 'react';
import { RecoilState } from 'recoil';
import { PostRsp } from '../../../global/interface/post';
import { systemPostRspHashMapAtom } from '../../../states/SystemConfigAtom';
import HeartButtonListFactory from './heartbutton/HeartButtonListFactory';
import HeartButtonSingleFactory from './heartbutton/HeartButtonSingleFactory';

interface HeartButtonFactoryProps {
  postId: string;
  listState?: RecoilState<Map<string, PostRsp>>;
  singleState?: RecoilState<PostRsp>;
  isList: boolean;
  funcHeartState?: () => void;
}

const HeartButtonFactory: React.FC<HeartButtonFactoryProps> = ({
  postId,
  listState,
  singleState,
  isList,
  funcHeartState,
}) => {
  return (
    <>
      {isList ? (
        <>
          {listState && (
            <HeartButtonListFactory
              postId={postId}
              postRspHashMapAtom={listState}
              systemPostRspHashMapAtom={systemPostRspHashMapAtom}
            />
          )}
        </>
      ) : (
        <>
          {singleState && (
            <HeartButtonSingleFactory
              postId={postId}
              postRspAtom={singleState}
              systemPostRspHashMapAtom={systemPostRspHashMapAtom}
              funcHeartState={funcHeartState}
            />
          )}
        </>
      )}
    </>
  );
};

export default HeartButtonFactory;
