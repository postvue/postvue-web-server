import { onClickHeartGlobalState } from 'global/globalstateaction/onClickHeartGlobalState';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import React from 'react';
import { RecoilState, useRecoilState } from 'recoil';
import { PostLikeRsp, PostRsp } from '../../../../global/interface/post';
import HeartButton from './HeartButton';

interface HeartButtonListFactoryProps {
  username: string;
  postId: string;
  systemPostRspHashMapAtom: RecoilState<Map<string, PostRsp>>;
}

const HeartButtonListFactory: React.FC<HeartButtonListFactoryProps> = ({
  username,
  postId,
  systemPostRspHashMapAtom,
}) => {
  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );
  const { data: snsProfilePostList } =
    QueryStateProfileAccountPostList(username);

  const setHeartListButtonState = (value: PostLikeRsp) => {
    onClickHeartGlobalState(
      username,
      postId,
      value.isLike,
      snsSystemPostHashMap,
      setSnsSystemPostHashMap,
    );
  };

  return (
    <>
      <HeartButton
        postId={postId}
        setHeartStete={setHeartListButtonState}
        isLiked={
          snsProfilePostList?.pages
            .flatMap((value) => value.snsPostRspList)
            .find((value) => value.postId === postId)?.isLiked || false
        }
      />
    </>
  );
};

export default HeartButtonListFactory;
