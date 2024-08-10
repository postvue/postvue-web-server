import React, { useEffect } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { NO_IMAGE_DATA_LINK } from '../../../const/DummyDataConst';
import { POST_TEXTFIELD_TYPE } from '../../../const/PostContentTypeConst';
import { HomePostRsp } from '../../../global/interface/post';

import styled from 'styled-components';
import SearchPostListInfiniteScroll from '../../../hook/SearchPostListInfiniteScroll';
import {
  cursorIdAtomBySearchPost,
  searchPostHashMapAtom,
  searchWordAtom,
} from '../../../states/SearchPostAtom';
import MasonryLayout from '../../layouts/MasonryLayout';

const SearchPostBody: React.FC = () => {
  const searchPostHashMap = useRecoilValue(searchPostHashMapAtom);
  const searchWord = useRecoilValue(searchWordAtom);

  const resetCursorIdBySearchPost = useResetRecoilState(
    cursorIdAtomBySearchPost,
  );
  const resetSearchPostHashMap = useResetRecoilState(searchPostHashMapAtom);

  useEffect(() => {
    return () => {
      resetCursorIdBySearchPost();
      resetSearchPostHashMap();
    };
  }, []);

  return (
    <SearchPostBodyContinaer>
      <MasonryLayout
        snsPostUrlList={Array.from(searchPostHashMap.entries()).map(([, v]) => {
          let imageContent = v.postContents.find(
            (postContent) =>
              postContent.postContentType !== POST_TEXTFIELD_TYPE,
          )?.content;
          imageContent = imageContent ? imageContent : NO_IMAGE_DATA_LINK;

          const homePostRsp: HomePostRsp = {
            postId: v.postId,
            userId: v.userId,
            postContent: imageContent,
            username: v.username,
          };

          return homePostRsp;
        })}
      />
      <SearchPostListInfiniteScroll searchWord={searchWord} />
    </SearchPostBodyContinaer>
  );
};

const SearchPostBodyContinaer = styled.div`
  margin-top: 24px;
`;

export default SearchPostBody;
