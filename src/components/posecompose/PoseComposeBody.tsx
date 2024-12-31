import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SetterOrUpdater, useRecoilState, useResetRecoilState } from 'recoil';
import {
  isActivPostComposeLocationPopupAtom,
  isActivPostComposeTargetAudiencePopupAtom,
  postComposeAddressRelationAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';

import { ReactComponent as AccountSettingArrowButtonIcon } from 'assets/images/icon/svg/AccountSettingArrowButtonIcon.svg';
import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import LoadingPopup from 'components/popups/LoadingPopup';
import TagSearchPopup from 'components/popups/tagsearchpopup/TagSearchPopup';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import {
  POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME,
  POST_COMPOSE_LOCATION_TAB_NAME,
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

import { ReactComponent as PostComposeDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeDeleteButtonIcon.svg';

import { ReactComponent as PostComposeButtonIcon } from 'assets/images/icon/svg/post/PostComposeButtonIcon.svg';
import { ReactComponent as PostImageCropButtonIcon } from 'assets/images/icon/svg/post/PostImageCropButtonIcon.svg';
import { ReactComponent as PostComposeTagDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeTagDeleteButtonIcon.svg';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import HorizontalGrabScrollContainer from 'components/common/container/HorizontalGrabScrollContainer';
import PostComposeCropPopup from 'components/popups/postcompose/postcomposecropppopup/PostComposeCropPopup';
import PostComposeLocationPopup from 'components/popups/postcompose/postcomposelocationpopup/PostComposeLocationPopup';
import PostComposeTargetAudiencePopup from 'components/popups/postcompose/PostComposeTargetAudiencePopup';
import {
  FILE_IMAGE_CONTENT_TYPE,
  FILE_VIDEO_CONTENT_TYPE,
} from 'const/fileConst';
import {
  MAX_POST_VIDEO_DURATION,
  POST_COMPOSEUPLOAD_MAX_NUM,
} from 'const/PostComposeConst';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { useDropzone } from 'react-dropzone';
import PostComposeButton from './PostComposeButton';
import PostUploadVideoElement from './PostUploadVideoElement';

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

const PoseComposeBody: React.FC<PostComposeBodyProps> = ({
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
  // 팝업 상태 값
  const [
    isActivPostComposeTargetAudiencePopup,
    setIsActivPostComposeTargetAudiencePopup,
  ] = useRecoilState(isActivPostComposeTargetAudiencePopupAtom);

  const bottomNextButtonRef = useRef<HTMLDivElement>(null);
  const postUploadListRef = useRef<HTMLDivElement>(null);
  const tagListRef = useRef<HTMLDivElement>(null);
  const [bottomNextButtonHeight, setBottomNextButtonHeight] =
    useState<number>(0);

  // 포스트 콘텐츠 내용
  const [poseComposeAddressRelation, setPoseComposeAddressRelation] =
    useRecoilState(postComposeAddressRelationAtom);

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

  const postComposeTabList = [
    {
      tabName: POST_COMPOSE_LOCATION_TAB_NAME,
      func: () => setIsActivePostComposeLocationPopup(true),
    },
    {
      tabName: POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME,
      func: () => setIsActivPostComposeTargetAudiencePopup(true),
    },
  ];

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileType = file.type.startsWith(FILE_IMAGE_CONTENT_TYPE)
      ? FILE_IMAGE_CONTENT_TYPE
      : FILE_VIDEO_CONTENT_TYPE;
    const fileBlobUrl = URL.createObjectURL(file);

    if (fileType === FILE_VIDEO_CONTENT_TYPE) {
      const video = document.createElement('video');
      video.src = fileBlobUrl;
      video.onloadedmetadata = () => {
        const duration = video.duration;
        if (duration > MAX_POST_VIDEO_DURATION) {
          // 300초 = 5분
          alert(
            `${MAX_POST_VIDEO_DURATION}분 이하의 영상만 업로드할 수 있습니다.`,
          );
          URL.revokeObjectURL(fileBlobUrl); // 메모리 누수 방지
          return null;
        } else {
          setPostUploadContentList((prev) => [
            ...prev,
            {
              contentUrl: fileBlobUrl,
              contentType: POST_VIDEO_TYPE,
              isLink: false,
              fileBlob: file,
              isUploadedLink: false,
              filename: file.name,
              sort: prev.length,
            },
          ]); // 이미지 미리보기 URL 설정
        }
      };
    } else {
      setPostUploadContentList((prev) => [
        ...prev,
        {
          contentUrl: fileBlobUrl,
          contentType: POST_IMAGE_TYPE,
          isLink: false,
          fileBlob: file,
          isUploadedLink: false,
          filename: file.name,
          sort: prev.length,
        },
      ]); // 이미지 미리보기 URL 설정
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/webm': ['.webm'],
      'application/vnd.apple.mpegurl': ['.m3u8'],
    },
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false); // cropper UI 상태

  const handleShowCropper = (imageUrl: string) => {
    setImageUrl(imageUrl);
    setShowCropper(true); // "자르기" 버튼 클릭 시 cropper UI 표시
  };

  return (
    <>
      <PoseComposeBodyContainer>
        <ProfileScrapImgListWrap ref={postUploadListRef}>
          {postUploadContentList.map((value, k) => (
            <PostImgWrap key={k}>
              {value.contentType === POST_IMAGE_TYPE ? (
                <>
                  <PostUploadImg src={value.contentUrl} />
                  {!value.isLink &&
                    !value.filename.toLowerCase().endsWith('.gif') && (
                      <PostImgCropButton
                        onClick={() => handleShowCropper(value.contentUrl)}
                      >
                        <PostImageCropButtonIcon />
                      </PostImgCropButton>
                    )}
                </>
              ) : (
                <PostUploadVideoElement videoUrl={value.contentUrl} />
              )}

              {postUploadContentList.length > 1 && (
                <PostComposeDeleteButtonWrap
                  onClick={() => {
                    setPostUploadContentList((prev) =>
                      prev.filter(
                        (prevValue) =>
                          prevValue.contentUrl !== value.contentUrl,
                      ),
                    );
                  }}
                >
                  <PostComposeDeleteButtonIcon />
                </PostComposeDeleteButtonWrap>
              )}
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
            ),
          )}
        </ProfileScrapImgListWrap>
        <PostComposeTitleWrap>
          <PostComposeTitle
            placeholder={'제목을 넣어주세요'}
            onChange={(e) => setPostTitle(e.target.value)}
            value={postTitle}
          ></PostComposeTitle>
        </PostComposeTitleWrap>
        <PostComposeDescWrap>
          <PostComposeDesc
            rows={8}
            placeholder={'게시물 문구를 작성하세요.'}
            onChange={(e) => setPostBodyText(e.target.value)}
            value={postBodyText}
          ></PostComposeDesc>
        </PostComposeDescWrap>

        <PostBottomLayoutContainer>
          <PostComposeBodyConatiner
            $bottomNextButtonHeight={bottomNextButtonHeight}
          >
            <PostComposeTagListContainer>
              <HorizontalGrabScrollContainer horiontalContainerRef={tagListRef}>
                {postTagList.map((value, key) => (
                  <PostComposeTagWrap key={key}>
                    <BorderCircleButton
                      className={ACTIVE_CLASS_NAME}
                      contentText={`#${value}`}
                      activeBackgroundColor={theme.mainColor.Blue}
                      activeBorderColor={theme.mainColor.Blue}
                      activeFontColor={theme.mainColor.White}
                    />
                    <PostComposeTagDeleteWrap
                      onClick={() => {
                        setPostTagList((prev) =>
                          prev.filter((preValue) => preValue !== value),
                        );
                      }}
                    >
                      <PostComposeTagDeleteButtonIcon />
                    </PostComposeTagDeleteWrap>
                  </PostComposeTagWrap>
                ))}
                <BorderCircleButton
                  className={''}
                  contentText={'#해시태그'}
                  deactiveBackgroundColor={theme.grey.Grey1}
                  deactiveBorderColor={theme.grey.Grey1}
                  deactiveFontColor={theme.grey.Grey8}
                  onClickFunc={() => setIsTagSearchPopupAtom(true)}
                />
              </HorizontalGrabScrollContainer>
            </PostComposeTagListContainer>
            <PostComposeBodyWrap>
              {postComposeTabList.map((value, key) => (
                <React.Fragment key={key}>
                  <BoundaryStickBar />
                  <PostComposeElementWrap onClick={value.func}>
                    <PostComposeElementTitle>
                      {value.tabName}
                    </PostComposeElementTitle>
                    <PostComposeArrowButtonWrap>
                      {value.tabName ===
                        POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME && (
                        <PostComposeTargetDiv>
                          {targetAudTabList[targetAudienceId].tabName}
                        </PostComposeTargetDiv>
                      )}
                      {value.tabName === POST_COMPOSE_LOCATION_TAB_NAME && (
                        <PostComposeLcationDiv>
                          {poseComposeAddressRelation.roadAddr}
                        </PostComposeLcationDiv>
                      )}
                      <PostComposeArrowButtonSubWrap>
                        <AccountSettingArrowButtonIcon />
                      </PostComposeArrowButtonSubWrap>
                    </PostComposeArrowButtonWrap>
                  </PostComposeElementWrap>
                </React.Fragment>
              ))}
            </PostComposeBodyWrap>
          </PostComposeBodyConatiner>
        </PostBottomLayoutContainer>
      </PoseComposeBodyContainer>
      <PostComposeButton
        title={composeButtonTitle}
        bottomNextButtonRef={bottomNextButtonRef}
        onClickActionFunc={onClickActionFunc}
        isActive={postUploadContentList.length > 0}
      />

      <TagSearchPopup
        tagList={postTagList}
        setTagList={setPostTagList}
        hasTransparentOverLay={hasTransparentOverLay}
      />

      <PostComposeTargetAudiencePopup
        targetAudTabList={targetAudTabList}
        targetAudTabId={targetAudienceId}
        setTargetAudTabId={setTargetAudienceId}
        hasTransparentOverLay={hasTransparentOverLay}
      />

      <PostComposeLocationPopup
        setAddress={setPoseComposeAddressRelation}
        hasTransparentOverLay={hasTransparentOverLay}
      />

      <PostComposeCropPopup
        imageUrl={imageUrl || ''}
        setImageUrl={setImageUrl}
        showCropper={showCropper}
        setShowCropper={setShowCropper}
        setPostUploadContentList={setPostUploadContentList}
      />

      {isLoadingPopup && <LoadingPopup />}
    </>
  );
};

const PoseComposeBodyContainer = styled.div`
  margin-top: 6px;
  width: 100%;
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
  // @media (hover: hover) and (pointer: fine) {
  //   &:hover {
  //     filter: brightness(0.7);
  //   }
  // }
  // cursor: pointer;

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
  right: 0px;
  vertical-align: bottom;
  margin: 0 5px 5px 0;
  cursor: pointer;
`;

const PostComposeTitleWrap = styled.div`
  padding: 23px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 14px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeTitle = styled.input`
  width: 100%;
  outline: none;
  border: 0px;

  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.grey.Grey8};
  background-color: ${({ theme }) => theme.mainColor.White};
`;

const PostComposeDescWrap = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeDesc = styled.textarea`
  resize: none;
  width: 100%;

  font: ${({ theme }) => theme.fontSizes.Body3};
  outline: none;
  border: 0px;

  color: ${({ theme }) => theme.grey.Grey8};
  background-color: ${({ theme }) => theme.mainColor.White};

  &::-webkit-scrollbar {
    display: block;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.grey.Grey5};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.grey.Grey1};
  }
`;

const PostComposeBodyConatiner = styled.div<{
  $bottomNextButtonHeight: number;
}>`
    display: flex;
    flex-flow: column;
    gap: 16px;
    position: absolute;
    bottom: calc(${(props) => props.$bottomNextButtonHeight}px + 46px);
    width: 100%;
}`;

const PostComposeBodyWrap = styled.div``;

const PostComposeElementWrap = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  white-space: nowrap;
`;

const PostComposeArrowButtonWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const PostComposeArrowButtonSubWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

const PostBottomLayoutContainer = styled.div``;

const PostComposeTagListContainer = styled.div``;

const PostComposeTagListWrap = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeDeleteButtonWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px 5px 0 0;
  cursor: pointer;
`;

const PostComposeTagWrap = styled.div`
  position: relative;
`;

const PostComposeTagDeleteWrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
`;

const PostComposeTargetDiv = styled.div`
  margin: auto 0;
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const PostComposeLcationDiv = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const CropperContainer = styled.div`
  position: relative;
  width: 95%;
  height: 70%;
  margin: auto;

  && > .reactEasyCrop_Container {
    border-radius: 20px;
  }
`;

const SliderContainer = styled.div`
  position: relative;
  width: 90%;
  margin: 0 auto;
  height: 40px; /* 막대의 높이 */

  border-radius: 20px;
  cursor: pointer; /* 마우스를 올렸을 때 커서 변경 */
`;

const SliderBar = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 8px; /* 바의 두께 */
  background-color: ${({ theme }) => theme.mainColor.Blue};
  border-radius: 4px;
  transform: translateY(-50%);
`;

const SliderCircle = styled.div<{ $position: number }>`
  position: absolute;
  top: 50%;
  width: 24px; /* 원의 지름 */
  height: 24px; /* 원의 지름 */
  background-color: #ffffff; /* 원의 색상 */
  fill: var(--System-Colors-SC-L-White, #fff);
  filter: drop-shadow(0px 6px 13px rgba(0, 0, 0, 0.12))
    drop-shadow(0px 0.5px 4px rgba(0, 0, 0, 0.12));

  border-radius: 50%;
  transform: translate(-50%, -50%);
  left: ${(props) => props.$position}%;
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

export default PoseComposeBody;
