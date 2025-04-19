import React, { Suspense, useEffect, useState } from 'react';

import styled from 'styled-components';
import 'swiper/css';

import 'react-loading-skeleton/dist/skeleton.css';
import { isValidString } from '../../../global/util/ValidUtil';

import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import 'swiper/css/pagination';

import LoadingComponent from 'components/common/container/LoadingComponent';
import SnsPostVirtualMasonryLayout from 'components/layouts/virtual/masonry/SnsPostVirtualMasonryLayout';
import { POST_RELATION_SEARCH_TYPE } from 'const/PostConst';
import { PostRsp } from 'global/interface/post';
import PostRelationListInfiniteScroll from 'hook/PostRelationInfiniteScroll';
import { QueryStatePostRelationListInfinite } from 'hook/queryhook/QueryStatePostRelationListInfinite';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';

interface ProfilePostDetailBodyProps {
  postId: string;
  snsPost: PostRsp;
  windowWidthSize: number;
  fixNum?: number;
  linkPopupInfo: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  searchType?: POST_RELATION_SEARCH_TYPE;
}

const ProfilePostDetailBodyRelation: React.FC<ProfilePostDetailBodyProps> = ({
  postId,
  snsPost,
  windowWidthSize,
  fixNum,
  linkPopupInfo,
  searchType,
}) => {
  const [isActiveRelation, setIsActiveRelation] = useState<boolean>(false);

  const { data: profilePostList } = QueryStateProfileAccountPostList(
    snsPost.username,
    isActiveRelation,
  );

  const {
    data: postRelationList,
    isFetched: isFetchedByPostRelationList,
    isLoading: isLoadingByPostRelationList,
  } = QueryStatePostRelationListInfinite(postId || '', searchType);

  useEffect(() => {
    if (!isFetchedByPostRelationList || !postRelationList) return;
    if (postRelationList.pages.flatMap((value) => value).length <= 0) {
      setIsActiveRelation(true);
    } else {
      setIsActiveRelation(false);
    }
  }, [isFetchedByPostRelationList]);

  // 포스트 게시물 영역 보이는 지

  const [isPopupRendered, setIsPopupRendered] = useState<boolean>(false);

  useEffect(() => {
    if (isValidString(postId)) {
      if (windowWidthSize > MEDIA_MOBILE_MAX_WIDTH_NUM) {
        setIsPopupRendered(true);
      } else {
        setTimeout(() => {
          setIsPopupRendered(true);
        }, 1500);
      }
    } else {
      setIsPopupRendered(false);
    }

    return () => {
      setIsPopupRendered(false);
    };
  }, [postId]);

  return (
    <ProfilePostContainer>
      <RelatedPostContainer>
        <RelatedTitle>연관 게시물</RelatedTitle>
        {isPopupRendered ? (
          <>
            {postId && (
              <>
                {postRelationList &&
                  isFetchedByPostRelationList &&
                  postRelationList?.pages.flatMap((value) => value).length >
                    0 &&
                  !isLoadingByPostRelationList && (
                    <PostRelationWrap>
                      <Suspense fallback={<></>}>
                        <SnsPostVirtualMasonryLayout
                          snsPostList={postRelationList.pages.flatMap(
                            (page) => page,
                          )}
                          // isAutoPlay={false} // 비디오 자동 실행
                          // linkPopupInfo={linkPopupInfo}
                          // fixNum={fixNum}
                          // searchType={searchType}
                          inViewElement
                        />
                      </Suspense>

                      <PostRelationListInfiniteScroll
                        postId={postId}
                        searchType={searchType}
                      />
                    </PostRelationWrap>
                  )}
              </>
            )}
            {/* {isFetchedByPostRelationList &&
              postRelationList &&
              profilePostList &&
              postRelationList?.pages.flatMap((value) => value).length <= 0 && (
                <PostRelationWrap>
                  <Suspense fallback={<></>}>
                    <SnsPostVirtualMasonryLayout
                      snsPostList={profilePostList?.pages
                        .flatMap((value) => value.snsPostRspList)
                        .filter((value) => value.postId !== postId)}
                      // isAutoPlay={false}
                      // fixNum={fixNum}
                      // linkPopupInfo={linkPopupInfo}
                    />
                  </Suspense>
                  <ProfileAccountPostListInfiniteScroll
                    username={snsPost.username}
                  />
                </PostRelationWrap>
              )} */}
          </>
        ) : (
          <div>
            <div style={{ position: 'relative' }}>
              <LoadingComponent
                LoadingComponentStyle={{
                  display: 'flex',
                  position: 'static',
                  left: 0,
                  transform: 'none',
                  top: 0,
                  padding: '50px 0 50px 0',
                }}
                LoadingImgStyle={{ margin: '0 auto' }}
              />
            </div>
          </div>
        )}
      </RelatedPostContainer>
    </ProfilePostContainer>
  );
};

const ProfilePostContainer = styled.div``;

const RelatedPostContainer = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const RelatedTitle = styled.div`
  padding: 14px 0 0 22px;
`;

const PostRelationWrap = styled.div`
  padding: 15px 11px 0 11px;
`;

export default ProfilePostDetailBodyRelation;
