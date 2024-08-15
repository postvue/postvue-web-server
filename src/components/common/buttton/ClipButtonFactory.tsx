import React from 'react';
import { RecoilState } from 'recoil';
import { PostRsp } from '../../../global/interface/post';
import ClipButtonListFactory from './clipbutton/CliipButtonListFactory';
import ClipButtonSingleFactory from './clipbutton/ClipButtonSingleFactory';

interface ClipButtonFactoryProps {
  postId: string;
  state: RecoilState<Map<string, PostRsp>> | RecoilState<PostRsp>;
}

const ClipButtonFactory: React.FC<ClipButtonFactoryProps> = ({
  postId,
  state,
}) => {
  const isMapState = (
    state: RecoilState<Map<string, PostRsp>> | RecoilState<PostRsp>,
  ): state is RecoilState<Map<string, PostRsp>> => {
    return (state as RecoilState<Map<string, PostRsp>>).key !== undefined;
  };

  return (
    <>
      {isMapState(state) ? (
        <ClipButtonListFactory postId={postId} postRspHashMapAtom={state} />
      ) : (
        <ClipButtonSingleFactory postId={postId} postRspAtom={state} />
      )}
    </>
  );
};

export default ClipButtonFactory;
