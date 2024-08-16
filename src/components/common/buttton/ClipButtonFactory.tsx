import React from 'react';
import { RecoilState } from 'recoil';
import { PostRsp } from '../../../global/interface/post';
import ClipButtonListFactory from './clipbutton/CliipButtonListFactory';
import ClipButtonSingleFactory from './clipbutton/ClipButtonSingleFactory';

interface ClipButtonFactoryProps {
  postId: string;
  listState?: RecoilState<Map<string, PostRsp>>;
  singleState?: RecoilState<PostRsp>;
  isList: boolean;
}

const ClipButtonFactory: React.FC<ClipButtonFactoryProps> = ({
  postId,
  isList,
  listState,
  singleState,
}) => {
  return (
    <>
      {isList ? (
        <>
          {listState && (
            <ClipButtonListFactory
              postId={postId}
              postRspHashMapAtom={listState}
            />
          )}
        </>
      ) : (
        <>
          {singleState && (
            <ClipButtonSingleFactory
              postId={postId}
              postRspAtom={singleState}
            />
          )}
        </>
      )}
    </>
  );
};

export default ClipButtonFactory;
