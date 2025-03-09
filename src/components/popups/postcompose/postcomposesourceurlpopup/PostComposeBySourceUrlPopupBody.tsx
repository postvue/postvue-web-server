import loadingBarGif from 'assets/images/gif/loadingBar.gif';
import NoResultComponent from 'components/common/container/NoResultComponent';
import ResultComponent from 'components/common/container/ResultComponent';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { POST_COMPOSEUPLOAD_MAX_NUM } from 'const/PostComposeConst';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { MasonryPostRsp } from 'global/interface/post';
import { QueryStatePostResourceDocImageList } from 'hook/queryhook/QueryStatePostResourceDocImageList';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  postComposeBySourceUrlListAtom,
  uploadResourceListAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';
import theme from 'styles/theme';
import PostComposeBySourceUrlMasonryLayout from './PostComposeBySourceUrlMasonryLayout';

interface PostComposeBySourceUrlPopupBody {
  postComposeSearchInput: string;
  isScroll?: boolean;
}

const PostComposeBySourceUrlPopupBody: React.FC<
  PostComposeBySourceUrlPopupBody
> = ({ postComposeSearchInput, isScroll = true }) => {
  const [isFetching, setFetching] = useState<boolean>(false);

  const { data, isFetched, isLoading, isError, isSuccess, error } =
    QueryStatePostResourceDocImageList(postComposeSearchInput, isFetching);

  const [postComposeBySourceUrlList, setPostComposeBySourceUrlList] =
    useRecoilState(postComposeBySourceUrlListAtom);

  const [uploadResourceList, setUploadResourceList] = useRecoilState(
    uploadResourceListAtom,
  );

  const hasClass = (
    ref: HTMLElement | HTMLVideoElement,
    className: string,
  ): boolean => {
    return ref?.classList.contains(className) || false;
  };

  const handleElementAction = (ref: HTMLImageElement | HTMLVideoElement) => {
    const isActive = hasClass(ref, ACTIVE_CLASS_NAME);
    const borderStyle = `${theme.mainColor.White} 0px 0px 0px 0px, ${theme.mainColor.Blue} 0px 0px 0px 3px`;
    if (isActive) {
      ref.classList.remove(ACTIVE_CLASS_NAME);
      setTimeout(() => {
        ref.style.boxShadow = '';
      }, 100);

      setUploadResourceList((prev) =>
        prev.filter((value) => value.contentUrl !== ref.src),
      );
    } else {
      if (uploadResourceList.length >= POST_COMPOSEUPLOAD_MAX_NUM) return;
      ref.classList.add(ACTIVE_CLASS_NAME);
      ref.style.boxShadow = borderStyle;

      setUploadResourceList((prev) => [
        ...prev,
        {
          contentUrl: ref.src,
          contentType: POST_IMAGE_TYPE,
          isLink: true,
          fileBlob: null,
          isUploadedLink: false,
          filename: ref.src,
          sort: prev.length,
          isExist: false,
        },
      ]);
    }
  };

  const actionFuncByRef = (ref: HTMLImageElement | HTMLVideoElement) => {
    if (ref instanceof HTMLImageElement) {
      handleElementAction(ref);
    } else if (ref instanceof HTMLVideoElement) {
      handleElementAction(ref);
    }
  };

  useEffect(() => {
    return () => {
      setPostComposeBySourceUrlList([]);
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    setPostComposeBySourceUrlList(data);
    setFetching(false);
  }, [data]);

  useEffect(() => {
    if (!isSuccess) {
      setPostComposeBySourceUrlList([]);
    }
  }, [isSuccess]);

  const PostComosePopupContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <PostComposePopupContainer ref={PostComosePopupContainerRef}>
        <PostComposeMasonryWrap>
          {!isLoading ? (
            <MasonryLayoutWrap
              $isScroll={isScroll}
              $height={PostComosePopupContainerRef.current?.offsetHeight}
              $isActive={uploadResourceList.length < POST_COMPOSEUPLOAD_MAX_NUM}
            >
              {postComposeBySourceUrlList.length > 0 ? (
                <PostComposeBySourceUrlMasonryLayout
                  MasonryContainerStyle={{ marginTop: '10px' }}
                  longPressToResizeNum={0.95}
                  snsPostUrlList={postComposeBySourceUrlList.map((v) => {
                    const homePostRsp: MasonryPostRsp = {
                      postId: '',
                      userId: '',
                      postContent: v.contentUrl,
                      postContentType: v.contentType,
                      username: '',
                      location: {
                        latitude: 0,
                        longitude: 0,
                        address: '',
                        buildName: '',
                      },
                      previewImg: '',
                      isUploaded: false,
                      videoDuration: 0,
                    };

                    return homePostRsp;
                  })}
                  actionFuncByRef={actionFuncByRef}
                />
              ) : (
                <>
                  {isFetched && (
                    <>
                      {!isSuccess && isError ? (
                        <ResultComponent
                          title={error.response?.data.message || ''}
                        />
                      ) : (
                        <NoResultComponent />
                      )}
                    </>
                  )}
                </>
              )}
            </MasonryLayoutWrap>
          ) : (
            <LoadingWrap>
              <LoadingGif src={loadingBarGif} />
            </LoadingWrap>
          )}
        </PostComposeMasonryWrap>
      </PostComposePopupContainer>
    </>
  );
};

const PostComposePopupContainer = styled.div`
  height: calc(
    100dvh -
      ${theme.systemSize.header.heightNumber * 2 +
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--safe-area-inset-top',
          ),
        ) || 0}px
  );
`;

const PostComposeMasonryWrap = styled.div``;

const MasonryLayoutWrap = styled.div<{
  $isActive: boolean;
  $height: number | undefined;
  $isScroll: boolean;
}>`
  opacity: ${(props) => (props.$isActive ? 1 : 0.5)};
  height: ${(props) => props.$height && props.$height}px;
  overflow-y: ${(props) => (props.$isScroll ? 'scroll' : 'none')};
  border-radius: 0 0 20px 20px;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    height: ${(props) =>
      props.$height &&
      props.$height - 2 * theme.systemSize.header.heightNumber}px;
  }
`;

const LoadingWrap = styled.div`
  position: fixed;
  top: calc(30%);
  left: 50%;
  transform: translate(-50%, 50%);
`;

const LoadingBarSize = '50px';

const LoadingGif = styled.img`
  width: ${LoadingBarSize};
  height: ${LoadingBarSize};
`;

export default PostComposeBySourceUrlPopupBody;
