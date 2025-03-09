import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {
  isActivPostComposeLocationPopupAtom,
  isActivPostComposeTargetAudiencePopupAtom,
  postComposeAddressRelationAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';

import LoadingPopup from 'components/popups/LoadingPopup';
import TagSearchPopup from 'components/popups/tagsearchpopup/TagSearchPopup';
import {
  POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_ID,
  POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_NAME,
  POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_ID,
  POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_NAME,
  POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
  POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_NAME,
} from 'const/TabConfigConst';
import { PostUploadContent } from 'global/interface/post';
import { isTagSearchPopupAtom } from 'states/TagAtom';
import theme from 'styles/theme';

import { ReactComponent as PostComposeButtonIcon } from 'assets/images/icon/svg/post/PostComposeButtonIcon.svg';
import { ReactComponent as PostImageCropButtonIcon } from 'assets/images/icon/svg/post/PostImageCropButtonIcon.svg';
import PostComposeCropPopup from 'components/popups/postcompose/postcomposecropppopup/PostComposeCropPopup';
import PostComposeLocationPopup from 'components/popups/postcompose/postcomposelocationpopup/PostComposeLocationPopup';
import PostComposeTargetAudiencePopup from 'components/popups/postcompose/PostComposeTargetAudiencePopup';
import SelectScrapByComposePopup from 'components/popups/profilescrap/SelectScrapByComposePopup';
import { FILE_IMAGE_CONTENT_TYPE } from 'const/fileConst';
import { POST_COMPOSEUPLOAD_MAX_NUM } from 'const/PostComposeConst';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import {
  isApp,
  sendNativeImageUploadEvent,
} from 'global/util/reactnative/nativeRouter';
import { useDropzone } from 'react-dropzone';
import { nativeUploadImgFileAtom } from 'states/NativeAtom';
import { selectScrapByComposePopupInfoAtom } from 'states/ProfileAtom';
import PostComposeBodyBottomContent from './PostComposeBodyBottomContent';
import PostComposeBodyDesc from './PostComposeBodyDesc';
import PostComposeButton from './PostComposeButton';
import PostComposeDeleteButton from './PostComposeDeleteButton';
import PostComposeTitle from './PostComposeTitle';

interface PostComposeBodyProps {
  postTitle: string;
  postBodyText: string;
  postTagList: string[];
  postUploadContentList: PostUploadContent[];
  setPostUploadContentList: SetterOrUpdater<PostUploadContent[]>;
  setPostTitle: React.Dispatch<React.SetStateAction<string>>;
  setPostBodyText: React.Dispatch<React.SetStateAction<string>>;
  setPostTagList: React.Dispatch<React.SetStateAction<string[]>>;
  targetAudienceId: number;
  setTargetAudienceId: React.Dispatch<React.SetStateAction<number>>;
  isLoadingPopup: boolean;
  setIsLoadingPopup: React.Dispatch<React.SetStateAction<boolean>>;
  onClickActionFunc: () => void;
  composeButtonTitle: string;
  hasTransparentOverLay?: boolean;
}

const PostComposeBody: React.FC<PostComposeBodyProps> = ({
  postTitle,
  postBodyText,
  postTagList,
  postUploadContentList,
  targetAudienceId,
  setPostTitle,
  setPostBodyText,
  setPostTagList,
  setPostUploadContentList,
  setTargetAudienceId,
  isLoadingPopup,
  setIsLoadingPopup,
  onClickActionFunc,
  composeButtonTitle,
  hasTransparentOverLay = false,
}) => {
  const selectScrapByComposePopupInfo = useRecoilValue(
    selectScrapByComposePopupInfoAtom,
  );
  // 팝업 상태 값
  const isActivPostComposeTargetAudiencePopup = useRecoilValue(
    isActivPostComposeTargetAudiencePopupAtom,
  );

  const bottomNextButtonRef = useRef<HTMLDivElement>(null);
  const postUploadListRef = useRef<HTMLDivElement>(null);
  const [bottomNextButtonHeight, setBottomNextButtonHeight] =
    useState<number>(0);

  // 포스트 콘텐츠 내용
  const setPoseComposeAddressRelation = useSetRecoilState(
    postComposeAddressRelationAtom,
  );

  const resetPoseComposeAddressRelation = useResetRecoilState(
    postComposeAddressRelationAtom,
  );

  const targetAudTabList = [
    {
      tabName: POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_NAME,
      tabId: POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
    },
    {
      tabName: POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_NAME,
      tabId: POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_ID,
    },
    {
      tabName: POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_NAME,
      tabId: POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_ID,
    },
  ];

  const [isTagSearchPopup, setIsTagSearchPopupAtom] =
    useRecoilState(isTagSearchPopupAtom);

  const [
    isActivePostComposeLocationPopup,
    setIsActivePostComposeLocationPopup,
  ] = useRecoilState(isActivPostComposeLocationPopupAtom);

  useEffect(() => {
    if (bottomNextButtonRef.current) {
      setBottomNextButtonHeight(bottomNextButtonRef.current.offsetHeight);
    }

    return () => {
      setPostUploadContentList([]);
      setIsTagSearchPopupAtom(false);
      setIsLoadingPopup(false);
      setIsActivePostComposeLocationPopup(false);
      resetPoseComposeAddressRelation();
    };
  }, []);

  useEffect(() => {
    if (postUploadListRef.current) {
      postUploadListRef.current.scrollLeft =
        postUploadListRef.current.scrollWidth;
    }
  }, [postUploadContentList]);

  const onUploadMedia = (blobUrl: string, file: File) => {
    setPostUploadContentList((prev) => [
      ...prev,
      {
        contentUrl: blobUrl,
        contentType: POST_IMAGE_TYPE,
        isLink: false,
        fileBlob: file,
        isUploadedLink: false,
        filename: file.name,
        sort: prev.length,
        isExist: false,
      },
    ]); // 이미지 미리보기 URL 설정
  };

  const nativeUploadImgFile = useRecoilValue(nativeUploadImgFileAtom);
  const resetNativeUploadImgFile = useResetRecoilState(nativeUploadImgFileAtom);

  useEffect(() => {
    if (!isApp() || nativeUploadImgFile.imgFile === null) return;

    onUploadMedia(
      URL.createObjectURL(nativeUploadImgFile.imgFile),
      nativeUploadImgFile.imgFile,
    );
    resetNativeUploadImgFile();
  }, [nativeUploadImgFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file.type.startsWith(FILE_IMAGE_CONTENT_TYPE)) {
      throw new Error('해당 미디어는 지원하지 않습니다.');
    }
    const fileBlobUrl = URL.createObjectURL(file);

    onUploadMedia(fileBlobUrl, file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    multiple: false,
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false); // cropper UI 상태

  const handleShowCropper = (imageUrl: string) => {
    setImageUrl(imageUrl);
    setShowCropper(true); // "자르기" 버튼 클릭 시 cropper UI 표시
  };

  return (
    <>
      <PostComposeBodyContainer>
        <div style={{ paddingTop: `env(safe-area-inset-top)` }} />
        <ProfileScrapImgListWrap ref={postUploadListRef}>
          {postUploadContentList.map((value, k) => (
            <PostImgWrap key={k}>
              <>
                <PostUploadImg src={value.contentUrl} />
                {!value.isLink &&
                  !value.filename.toLowerCase().endsWith('.gif') && (
                    <PostImgCropButton
                      onClick={() => handleShowCropper(value.contentUrl)}
                    >
                      <PostComposeDeleteButtonWrap>
                        <PostComposeDeleteIconButton>
                          <PostComposeDeleteSubButton>
                            <PostImageCropButtonIcon />
                          </PostComposeDeleteSubButton>
                        </PostComposeDeleteIconButton>
                      </PostComposeDeleteButtonWrap>
                    </PostImgCropButton>
                  )}
              </>

              <PostComposeDeleteButton
                actionFunc={() => {
                  setPostUploadContentList((prev) =>
                    prev.filter(
                      (prevValue) => prevValue.contentUrl !== value.contentUrl,
                    ),
                  );
                }}
              />
            </PostImgWrap>
          ))}
          {Array.from(
            {
              length: Math.min(
                1,
                Math.max(
                  POST_COMPOSEUPLOAD_MAX_NUM - postUploadContentList.length,
                  0,
                ),
              ),
            },
            (_, index) => (
              <React.Fragment key={index}>
                {isApp() ? (
                  <PostImgWrap
                    key={index}
                    onClick={() => {
                      sendNativeImageUploadEvent();
                    }}
                  >
                    <PostEmptyImgWrap $isDragActive={isDragActive}>
                      <PostEmptyImgSubWrap>
                        <PostUploadButton>
                          <PostComposeButtonIcon />
                        </PostUploadButton>
                        <PostUploadDraggableTitle>
                          파일을 선택하거나 <br />
                          여기로 끌어다 놓으세요.
                        </PostUploadDraggableTitle>
                      </PostEmptyImgSubWrap>
                    </PostEmptyImgWrap>
                  </PostImgWrap>
                ) : (
                  <PostImgWrap key={index} {...getRootProps()}>
                    <PostEmptyImgWrap $isDragActive={isDragActive}>
                      <PostEmptyImgSubWrap>
                        <PostUploadButton>
                          <PostComposeButtonIcon />
                        </PostUploadButton>
                        <PostUploadDraggableTitle>
                          파일을 선택하거나 <br />
                          여기로 끌어다 놓으세요.
                        </PostUploadDraggableTitle>
                      </PostEmptyImgSubWrap>
                      <input {...getInputProps()} />
                    </PostEmptyImgWrap>
                  </PostImgWrap>
                )}
              </React.Fragment>
            ),
          )}
        </ProfileScrapImgListWrap>

        <PostComposeTitle postTitle={postTitle} setPostTitle={setPostTitle} />
        <PostComposeBodyDesc
          postBodyText={postBodyText}
          setPostBodyText={setPostBodyText}
        />

        <PostComposeBodyBottomContent
          postTagList={postTagList}
          setPostTagList={setPostTagList}
          targetAudienceId={targetAudienceId}
          setTargetAudienceId={setTargetAudienceId}
          bottomNextButtonHeight={bottomNextButtonHeight}
        />
      </PostComposeBodyContainer>
      <PostComposeButton
        title={composeButtonTitle}
        bottomNextButtonRef={bottomNextButtonRef}
        onClickActionFunc={onClickActionFunc}
        isActive={postUploadContentList.length > 0}
        PostComposeButtonStyle={{ position: 'static' }}
      />

      {isTagSearchPopup && (
        <TagSearchPopup
          tagList={postTagList}
          setTagList={setPostTagList}
          hasTransparentOverLay={hasTransparentOverLay}
        />
      )}

      {isActivPostComposeTargetAudiencePopup && (
        <PostComposeTargetAudiencePopup
          targetAudTabList={targetAudTabList}
          targetAudTabId={targetAudienceId}
          setTargetAudTabId={setTargetAudienceId}
          hasTransparentOverLay={hasTransparentOverLay}
        />
      )}

      {isActivePostComposeLocationPopup && (
        <PostComposeLocationPopup
          setAddress={setPoseComposeAddressRelation}
          hasTransparentOverLay={hasTransparentOverLay}
        />
      )}

      {showCropper && (
        <PostComposeCropPopup
          imageUrl={imageUrl || ''}
          setImageUrl={setImageUrl}
          showCropper={showCropper}
          setShowCropper={setShowCropper}
          setPostUploadContentList={setPostUploadContentList}
        />
      )}

      {isLoadingPopup && <LoadingPopup />}
      {selectScrapByComposePopupInfo.isActive && <SelectScrapByComposePopup />}
    </>
  );
};

const PostComposeBodyContainer = styled.div`
  margin-top: 6px;
  width: 100%;

  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProfileScrapImgListWrap = styled.div`
  display: flex;
  gap: 5px;
  overflow-x: auto;
  white-space: nowrap;

  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PostImgWrap = styled.div`
  width: 40%;
  flex: 0 0 auto;

  position: relative;
`;

const PostSubImgWrap = styled.div`
  width: 100%;
  border-radius: 8px;
  aspect-ratio: 3/4;
`;

const PostEmptyImgWrap = styled(PostSubImgWrap)<{ $isDragActive: boolean }>`
  background-color: ${({ theme }) => theme.grey.Grey1};
  border: 2px solid
    ${(props) =>
      props.$isDragActive ? theme.mainColor.Blue : theme.grey.Grey1};
  display: flex;
  cursor: pointer;
`;

const PostEmptyImgSubWrap = styled.div`
  display: flex;
  margin: auto;
  flex-flow: column;
`;

const PostUploadImg = styled(PostSubImgWrap)<{ src: string }>`
  background: url(${(props) => props.src}) center center / cover;
  vertical-align: bottom;
`;

const PostImgCropButton = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0;
  vertical-align: bottom;
  cursor: pointer;
`;

const PostUploadButton = styled.div`
  display: flex;
  justify-content: center;
`;

const PostUploadDraggableTitle = styled.div`
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  text-align: center;
  padding: 0 20px;

  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey8};

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none;
  }
`;

const PostComposeDeleteButtonWrap = styled.div`
  position: absolute;
  bottom: 0;
  margin: 8px;
  cursor: pointer;
`;
const PostComposeDeleteIconButton = styled.div`
  background-color: black;
  display: flex;
  border-radius: 50%;
  height: 25px;
  width: 25px;
`;

const PostComposeDeleteSubButton = styled.div`
  display: flex;
  margin: auto;
`;

export default PostComposeBody;
