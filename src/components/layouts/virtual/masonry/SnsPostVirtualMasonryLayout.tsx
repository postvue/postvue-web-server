import React, { useCallback, useEffect, useRef, useState } from 'react';
// import list from './data';
import SnsPostMockVideoPreviewElement from 'components/common/posts/element/SnsPostMockVideoPreviewElement';
import SnsPostVirtualImagePreviewElement from 'components/common/posts/element/SnsPostVirtualImagePreviewElement';
import { PROFILE_POST_LIST_PATH } from 'const/PathConst';
import { POST_RELATION_SEARCH_TYPE } from 'const/PostConst';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import {
  POST_DETAIL_POPUP_PARAM,
  POST_DETAIL_POST_ID_PARAM,
  POST_DETAIL_PROFILE_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { MasonryPostRsp, PostRsp } from 'global/interface/post';
import useWindowSize from 'hook/customhook/useWindowSize';
import { generatePath, useNavigate } from 'react-router-dom';
import { Size } from 'react-virtualized';
import { SEARCH_TYPE_PARAM } from 'services/appApiQueryParam';
import theme from 'styles/theme';
import { Item, PostItem } from './Grid';
import ImageMeasurer from './ImageMessurer';
import MasonryInfiniteGrid from './MasonryInfiniteGrid';

const columnWidth = 200;
const defaultWidth = columnWidth;
const defaultHeight = 250;

const ContentBorderRadius = 22;

interface SnsPostVirtualMasonryLayoutProps {
  snsPostList: PostRsp[];
  actionFunc?: () => void;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  searchType?: POST_RELATION_SEARCH_TYPE;
  hasMore?: boolean;
  loadMore?: () => void;
  scrollElement?: Element;
  inViewElement?: React.ReactNode;
  scrapId?: string;
  isAutoPlay?: boolean;
  actionFuncByRef?: (value: HTMLImageElement | HTMLVideoElement) => void;
  longPressToResizeNum?: number;
}

const SnsPostVirtualMasonryLayout: React.FC<
  SnsPostVirtualMasonryLayoutProps
> = ({
  snsPostList,
  actionFunc,
  linkPopupInfo = {
    isLinkPopup: false,
    isReplaced: false,
  },
  searchType,
  hasMore = false,
  loadMore,
  scrollElement,
  inViewElement,
  scrapId,
  isAutoPlay = false,
  actionFuncByRef,
  longPressToResizeNum,
}) => {
  const [images, setImages] = useState<Item[]>([]);
  const [itemsWithSizes, setItemsWithSizes] = useState<PostItem[]>([]);
  const masonryRef = useRef<any>(null); // 타입을 정확히 지정하려면 Masonry | null

  useEffect(() => {
    setImages(
      snsPostList.map((v) => {
        return {
          postRsp: v,
          image:
            v.postContents[0].postContentType === POST_IMAGE_TYPE
              ? v.postContents[0].content
              : v.postContents[0].previewImg,
        };
      }),
    );
  }, [snsPostList]);

  const handleSizeCalculated = useCallback(
    (sizes: { [index: number]: Size }) => {
      const items = images.map((item, index) => ({
        image: item.image,
        postRsp: item.postRsp,
        size: sizes[index] || { width: defaultWidth, height: defaultHeight },
      }));
      setItemsWithSizes(items);
    },
    [images],
  );

  const { windowWidth } = useWindowSize();

  const navigate = useNavigate();

  const onClickMasonry = (post: PostRsp) => {
    if (
      window.innerWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ||
      linkPopupInfo.isLinkPopup
    ) {
      // 모바일 크기
      // url만 바뀌도록 변경

      const searchParams = new URLSearchParams(location.search);

      // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
      searchParams.set(POST_DETAIL_POPUP_PARAM, TRUE_PARAM);
      searchParams.set(POST_DETAIL_POST_ID_PARAM, post.postId);
      searchParams.set(POST_DETAIL_PROFILE_PARAM, post.username);

      // 새로운 쿼리 파라미터가 포함된 URL 생성
      const newSearch = searchParams.toString();
      const newPath =
        `${location.pathname}?${newSearch}` +
        (searchType ? `&${SEARCH_TYPE_PARAM}=${searchType}` : '');

      navigate(newPath, {
        replace: linkPopupInfo.isReplaced,
        state: { isDetailPopup: true },
      });
    } else {
      // 데스크탑 크기: url로 이동

      navigate(
        generatePath(PROFILE_POST_LIST_PATH, {
          user_id: post.username,
          post_id: post.postId,
        }),
        {
          state: { isDetailPopup: true },
        },
      );
    }
    if (actionFunc) {
      actionFunc();
    }
  };

  const returnPostMasonryItem = (imageUrl: string, postRsp: PostRsp) => {
    const postContent = postRsp.postContents[0];

    const masonryPostRsp: MasonryPostRsp = {
      postId: postRsp.postId,
      userId: postRsp.userId,
      postContent: postContent.content,
      postContentType: postContent.postContentType,
      username: postRsp.username,
      location: postRsp.location,
      previewImg: postContent.previewImg,
      videoDuration: postContent.videoDuration,
      isUploaded: postContent.isUploaded,
    };
    return masonryPostRsp.postContentType === POST_IMAGE_TYPE ? (
      <SnsPostVirtualImagePreviewElement
        imageSrc={imageUrl}
        actionFuncByRef={actionFuncByRef}
        selectPostRsp={postRsp}
        scrapId={scrapId}
        PostImageStyle={{
          objectFit: 'cover',
          display: 'block',
          borderRadius: `${ContentBorderRadius}px`,
        }}
        location={postRsp.location}
        ContentBorderRadius={ContentBorderRadius}
        longPressToResizeNum={longPressToResizeNum}
      />
    ) : (
      <SnsPostMockVideoPreviewElement
        imageSrc={imageUrl}
        actionFuncByRef={actionFuncByRef}
        selectPostRsp={postRsp}
        scrapId={scrapId}
        videoDuration={postRsp.postContents[0].videoDuration}
        PostImageStyle={{
          objectFit: 'cover',
          display: 'block',
          borderRadius: `${ContentBorderRadius}px`,
        }}
        location={postRsp.location}
        ContentBorderRadius={ContentBorderRadius}
        longPressToResizeNum={longPressToResizeNum}
      />
    );
  };

  return (
    <div>
      <ImageMeasurer items={images} onSizeCalculated={handleSizeCalculated}>
        {(sizes) => (
          <div ref={masonryRef} style={{ overflow: 'scroll' }}>
            <MasonryInfiniteGrid
              itemsWithSizes={itemsWithSizes}
              hasMore={hasMore}
              loadMore={() => {
                if (!loadMore) return;
                loadMore();
              }}
              onClickMasonry={onClickMasonry}
              returnPostMasonryItem={returnPostMasonryItem}
              masonryWidth={
                windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM
                  ? theme.systemSize.appDisplaySize.widthByPcNum
                  : windowWidth > theme.systemSize.appDisplaySize.maxWidthNum
                    ? theme.systemSize.appDisplaySize.maxWidthNum
                    : windowWidth
              }
              columnNum={windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM ? 3 : 2}
              scrollElement={scrollElement}
              inViewElement={inViewElement}
            />
          </div>
        )}
      </ImageMeasurer>
    </div>
  );
};

export default SnsPostVirtualMasonryLayout;
