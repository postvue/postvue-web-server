import React from 'react';
import { RecoilState } from 'recoil';
import { PostRsp } from '../../../global/interface/post';
import HeartButtonListFactory from './heartbutton/HeartButtonListFactory';
import HeartButtonSingleFactory from './heartbutton/HeartButtonSingleFactory';

interface HeartButtonFactoryProps {
  postId: string;
  state: RecoilState<Map<string, PostRsp>> | RecoilState<PostRsp>;
}

const HeartButtonFactory: React.FC<HeartButtonFactoryProps> = ({
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
        <HeartButtonListFactory postId={postId} postRspHashMapAtom={state} />
      ) : (
        <HeartButtonSingleFactory postId={postId} postRspAtom={state} />
      )}
    </>
  );
};

export default HeartButtonFactory;
