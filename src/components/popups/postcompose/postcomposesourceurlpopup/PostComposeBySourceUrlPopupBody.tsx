import loadingBarGif from 'assets/images/gif/loadingBar.gif';
import { ReactComponent as XButtonIcon } from 'assets/images/icon/svg/XButtonIcon.svg';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import NoResultComponent from 'components/common/container/NoResultComponent';
import ResultComponent from 'components/common/container/ResultComponent';
import SearchButtonInput from 'components/common/input/SearchButtonInput';
import HeaderLayout from 'components/layouts/HeaderLayout';
import MasonryLayout from 'components/layouts/MasonryLayout';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { POST_COMPOSEUPLOAD_MAX_NUM } from 'const/PostComposeConst';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { MAX_DELAY_SETTIMEOUT_TIME } from 'const/SystemAttrConst';
import { POST_COMPOSE_LINK_INPUT_PHASE_TEXT } from 'const/SystemPhraseConst';
import { MasonryPostRsp } from 'global/interface/post';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStatePostResourceDocImageList } from 'hook/queryhook/QueryStatePostResourceDocImageList';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  postComposeBySourceUrlListAtom,
  uploadResourceListAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface PostCOmposeBySourceUrlPopupBodyProps {
  bottomNextButtonActionFunc: () => void;
}

const PostComposeBySourceUrlPopupBody: React.FC<
  PostCOmposeBySourceUrlPopupBodyProps
> = ({ bottomNextButtonActionFunc }) => {
  const searchInputRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const [postComposeSearchInput, setPostComposeSearchInput] =
    useState<string>('');

  const [isFetching, setFetching] = useState<boolean>(false);

  const { data, isFetched, isLoading, isError, isSuccess, error } =
    QueryStatePostResourceDocImageList(postComposeSearchInput, isFetching);

  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );
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
      ref.style.boxShadow = '';
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

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostComposeSearchInput(event.target.value);
  };

  const onSearchInputDelete = () => {
    setPostComposeSearchInput('');
    setPostComposeBySourceUrlList([]);
    setUploadResourceList([]);
  };

  const isImageUrl = (url: string) => {
    const imageExtensions = [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'bmp',
      'tiff',
      'webp',
      'svg',
      'ico',
    ];
    const extension =
      url.split('.').pop()?.split('?')[0].toLowerCase() || 'none';
    return imageExtensions.includes(extension);
  };

  const isValidImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });

      const contentType = response.headers.get('Content-Type');

      return contentType?.startsWith('image/') || false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === 'Enter' &&
      event.nativeEvent.isComposing === false &&
      isValidString(postComposeSearchInput) &&
      !isFetching
    ) {
      setUploadResourceList([]);

      const validImage =
        isImageUrl(postComposeSearchInput) ||
        (await isValidImageUrl(postComposeSearchInput));

      if (validImage) {
        setPostComposeBySourceUrlList([
          {
            contentType: POST_IMAGE_TYPE,
            contentUrl: postComposeSearchInput,
          },
        ]);
      } else {
        setFetching(true);

        setTimeout(() => {
          setFetching(false);
        }, MAX_DELAY_SETTIMEOUT_TIME);
      }
      searchInputRef.current?.blur();
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

  useEffect(() => {
    console.log(PostComosePopupContainerRef.current?.offsetHeight);
  }, [PostComosePopupContainerRef]);

  return (
    <>
      <PostComposePopupContainer ref={PostComosePopupContainerRef}>
        <PrevButtonHeaderHeader
          titleName="이미지 고르기"
          isActionFunc={true}
          actionFunc={() => setIsActivePostComposeBySourceUrlPopup(false)}
          preNodeByState={<XButtonIcon />}
          HeaderLayoutStyle={{ backgroundColor: 'transparent' }}
          RightButtonNode={
            <PostComposeUploadNumWrap>
              {uploadResourceList.length}/{POST_COMPOSEUPLOAD_MAX_NUM}
            </PostComposeUploadNumWrap>
          }
        />

        <PostComposeMasonryWrap>
          <HeaderLayout>
            <PostComposeSearchInputWrap>
              <SearchButtonInputWrap>
                <SearchButtonInput
                  searchInputRef={searchInputRef}
                  placeholder={POST_COMPOSE_LINK_INPUT_PHASE_TEXT}
                  onSearchInputChange={onSearchInputChange}
                  onSearchInputKeyDown={handleKeyPress}
                  onClickDelete={onSearchInputDelete}
                  value={postComposeSearchInput}
                  isActiveDeleteButton={postComposeSearchInput !== ''}
                />
              </SearchButtonInputWrap>
            </PostComposeSearchInputWrap>
          </HeaderLayout>

          {!isLoading ? (
            <MasonryLayoutWrap
              $height={PostComosePopupContainerRef.current?.offsetHeight}
              $isActive={uploadResourceList.length < POST_COMPOSEUPLOAD_MAX_NUM}
            >
              {postComposeBySourceUrlList.length > 0 ? (
                <MasonryLayout
                  MasonryContainerStyle={{ marginTop: '10px' }}
                  longPressToResizeNum={0.9}
                  isActiveNavToPost={false}
                  snsPostUrlList={postComposeBySourceUrlList.map((v) => {
                    const homePostRsp: MasonryPostRsp = {
                      postId: '',
                      userId: '',
                      postContent: v.contentUrl,
                      postContentType: v.contentType,
                      username: '',
                      location: { latitude: 0, longitude: 0, address: '' },
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
      {uploadResourceList.length >= 1 && (
        <BottomNextButton
          title={'다음으로'}
          isTransparent={true}
          actionFunc={bottomNextButtonActionFunc}
          BottomNextButtonWrapContainerStyle={{ position: 'absolute' }}
        />
      )}
    </>
  );
};

const PostComposePopupContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const PostComposeMasonryWrap = styled.div``;

const PostComposeSearchInputWrap = styled.div`
  width: 100%;
  display: flex;
  margin: auto 0;
`;

const SearchButtonInputWrap = styled.div`
  padding: 0 10px;
  width: 100%;
`;

const MasonryLayoutWrap = styled.div<{
  $isActive: boolean;
  $height: number | undefined;
}>`
  opacity: ${(props) => (props.$isActive ? 1 : 0.5)};
  height: ${(props) =>
    props.$height &&
    props.$height - 2 * theme.systemSize.header.heightNumber}px;
  overflow-y: scroll;
  border-radius: 0 0 20px 20px;
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

const PostComposeUploadNumWrap = styled.div`
  display: flex;
  margin: auto 0px;
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

export default PostComposeBySourceUrlPopupBody;
