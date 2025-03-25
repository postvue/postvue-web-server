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
  isActivPostComposeVideoSelectTypePopupAtom,
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
import PostComposeLocationPopup from 'components/popups/postcompose/postcomposelocationpopup/PostComposeLocationPopup';
import PostComposeTargetAudiencePopup from 'components/popups/postcompose/PostComposeTargetAudiencePopup';
import PostVideoComposeSelectTypePopup from 'components/popups/postcompose/postvideocomposepopup/PostVideoComposeSelectTypePopup';
import SelectScrapByComposePopup from 'components/popups/profilescrap/SelectScrapByComposePopup';
import { FILE_IMAGE_CONTENT_TYPE } from 'const/fileConst';
import { MAX_POST_VIDEO_DURATION } from 'const/PostComposeConst';
import { POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { formatToMinutesAndSeconds } from 'global/util/DateTimeUtil';
import { isApp } from 'global/util/reactnative/nativeRouter';
import { useDropzone } from 'react-dropzone';
import { nativeUploadImgFileAtom } from 'states/NativeAtom';
import { selectScrapByComposePopupInfoAtom } from 'states/ProfileAtom';
import PostComposeBodyBottomContent from './PostComposeBodyBottomContent';
import PostComposeBodyDesc from './PostComposeBodyDesc';
import PostComposeButton from './PostComposeButton';
import PostComposeDeleteButton from './PostComposeDeleteButton';
import PostComposeTitle from './PostComposeTitle';
import PostUploadVideoElement from './PostUploadVideoElement';

interface PostVideoComposeBodyProps {
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
  isDeletePost?: boolean;
}

const PostVideoComposeBody: React.FC<PostVideoComposeBodyProps> = ({
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
  isDeletePost = true,
}) => {
  const selectScrapByComposePopupInfo = useRecoilValue(
    selectScrapByComposePopupInfoAtom,
  );
  // 팝업 상태 값
  const isActivPostComposeTargetAudiencePopup = useRecoilValue(
    isActivPostComposeTargetAudiencePopupAtom,
  );

  const [
    isActivPostComposeVideoSelectTypePopup,
    setIsActivPostComposeVideoSelectTypePopup,
  ] = useRecoilState(isActivPostComposeVideoSelectTypePopupAtom);

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
    const video = document.createElement('video');
    video.src = blobUrl;
    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (duration > MAX_POST_VIDEO_DURATION) {
        // 180초 = 3분
        alert(
          `${MAX_POST_VIDEO_DURATION}분 이하의 영상만 업로드할 수 있습니다.`,
        );
        URL.revokeObjectURL(blobUrl); // 메모리 누수 방지
        return null;
      } else {
        setPostUploadContentList((prev) => [
          ...prev,
          {
            contentUrl: blobUrl,
            contentType: POST_VIDEO_TYPE,
            isLink: false,
            fileBlob: file,
            isUploadedLink: false,
            filename: file.name,
            sort: prev.length,
            isExist: false,
          },
        ]); // 이미지 미리보기 URL 설정
      }
    };
  };

  const nativeUploadImgFile = useRecoilValue(nativeUploadImgFileAtom);
  const resetNativeUploadImgFile = useResetRecoilState(nativeUploadImgFileAtom);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!isApp() || nativeUploadImgFile.imgFile === null) return;
    const blobUrl = URL.createObjectURL(nativeUploadImgFile.imgFile);
    const file = nativeUploadImgFile.imgFile;

    setPostUploadContentList((prev) => [
      ...prev,
      {
        contentUrl: blobUrl,
        contentType: POST_VIDEO_TYPE,
        isLink: false,
        fileBlob: file,
        isUploadedLink: false,
        filename: file.name,
        sort: prev.length,
        isExist: false,
      },
    ]); // 이미지 미리보기 URL 설정
    setVideoDuration(nativeUploadImgFile.uploadInfo?.duration || null);
    resetNativeUploadImgFile();
  }, [nativeUploadImgFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileBlobUrl = URL.createObjectURL(file);
    if (file.type.startsWith(FILE_IMAGE_CONTENT_TYPE)) {
      throw new Error('지원하지 않는 미디어입니다.');
    }

    onUploadMedia(fileBlobUrl, file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/webm': ['.webm'],
      'application/vnd.apple.mpegurl': ['.m3u8'],
    },
    multiple: false,
  });

  return (
    <>
      <PoseComposeBodyContainer>
        <div style={{ paddingTop: `env(safe-area-inset-top)` }} />
        <ProfileScrapImgListWrap ref={postUploadListRef}>
          {postUploadContentList.length == 1 && (
            <PostImgWrap>
              {videoDuration && (
                <VideoDurationWrap>
                  <VideoDurationElement>
                    {formatToMinutesAndSeconds(Math.round(videoDuration))}
                  </VideoDurationElement>
                </VideoDurationWrap>
              )}

              {postUploadContentList[0].contentUrl && (
                <>
                  {isApp() ? (
                    <>
                      <PostUploadImg src={postUploadContentList[0].contentUrl}>
                        {isDeletePost && (
                          <PostComposeDeleteButton
                            actionFunc={() => setPostUploadContentList([])}
                          />
                        )}
                      </PostUploadImg>
                    </>
                  ) : (
                    <>
                      <PostUploadVideoElement
                        videoUrl={postUploadContentList[0].contentUrl}
                      />
                      {isDeletePost && (
                        <PostComposeDeleteButton
                          actionFunc={() => setPostUploadContentList([])}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </PostImgWrap>
          )}
          <>
            {postUploadContentList.length <= 0 && (
              <>
                {isApp() ? (
                  <PostImgWrap
                    onClick={() => {
                      setIsActivPostComposeVideoSelectTypePopup(true);
                    }}
                  >
                    <PostEmptyImgWrap $isDragActive={isDragActive}>
                      <PostEmptyImgSubWrap>
                        <PostUploadButton>
                          <PostComposeButtonIcon />
                        </PostUploadButton>
                      </PostEmptyImgSubWrap>
                    </PostEmptyImgWrap>
                  </PostImgWrap>
                ) : (
                  <PostImgWrap {...getRootProps()}>
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
              </>
            )}
          </>
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
      </PoseComposeBodyContainer>
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

      {isActivPostComposeVideoSelectTypePopup && (
        <PostVideoComposeSelectTypePopup />
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

      {isLoadingPopup && (
        <LoadingPopup>
          <LoadingTitle>업로드 중입니다. 잠시만 기다려주세요.</LoadingTitle>
        </LoadingPopup>
      )}
      {selectScrapByComposePopupInfo.isActive && <SelectScrapByComposePopup />}
    </>
  );
};

const PoseComposeBodyContainer = styled.div`
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
  margin: 0 auto;

  position: relative;
`;

const PostSubImgWrap = styled.div`
  width: 100%;
  border-radius: 20px;
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
  position: relative;
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
  color: ${({ theme }) => theme.grey.Grey6};

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none;
  }
`;

const VideoDurationWrap = styled.div`
  position: absolute;
  top: 0px;
  padding: 3px 9px;
  margin: 8px 0px 0px 8px;
  border-radius: 20px;

  background-color: rgb(247 247 247 / 50%);
  z-index: 10;
`;

const VideoDurationElement = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 13px;
  color: ${({ theme }) => theme.grey.Grey9};
`;

const LoadingTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 13px;
  color: ${({ theme }) => theme.grey.Grey9};
`;

export default PostVideoComposeBody;
