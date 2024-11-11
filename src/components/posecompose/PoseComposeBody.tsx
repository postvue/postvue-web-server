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
import { ReactComponent as PostVideoPauseButtonIcon } from 'assets/images/icon/svg/post/PostVideoPauseButtonIcon.svg';
import { ReactComponent as PostVideoPlayButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayButtonIcon.svg';
import { ReactComponent as PostComposeTagDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeTagDeleteButtonIcon.svg';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import PostComposeLocationPopup from 'components/popups/postcompose/PostComposeLocationPopup';
import PostComposeTargetAudiencePopup from 'components/popups/postcompose/PostComposeTargetAudiencePopup';
import {
  FILE_IMAGE_CONTENT_TYPE,
  FILE_VIDEO_CONTENT_TYPE,
} from 'const/fileConst';
import { POST_COMPOSEUPLOAD_MAX_NUM } from 'const/PostComposeConst';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { getCroppedImg, PixelCropType } from 'global/util/ImageInputUtil';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import PostComposeButton from './PostComposeButton';

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

    setPostUploadContentList((prev) => [
      ...prev,
      {
        contentUrl: fileBlobUrl,
        contentType:
          fileType === FILE_IMAGE_CONTENT_TYPE
            ? POST_IMAGE_TYPE
            : POST_VIDEO_TYPE,
        isLink: false,
        fileBlob: file,
        isUploadedLink: false,
        filename: file.name,
      },
    ]); // 이미지 미리보기 URL 설정
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'], // 비디오 파일 확장자 허용
    },
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayPauseVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying); // 재생/멈춤 상태 토글
    }
  };
  const handleVideoEnded = () => {
    setIsPlaying(false); // 비디오가 끝나면 상태를 false로 설정
  };

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCropType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false); // cropper UI 상태

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    if (croppedAreaPixels && imageUrl) {
      const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
      if (croppedBlob) {
        const blobUrl = URL.createObjectURL(croppedBlob);
        setPostUploadContentList((prev) =>
          prev.map((value) => {
            if (value.contentUrl === imageUrl) {
              return {
                ...value,
                contentUrl: blobUrl,
                fileBlob: croppedBlob,
                contentType: POST_IMAGE_TYPE,
              };
            } else {
              return value;
            }
          }),
        );
      }

      setImageUrl(null);
      setShowCropper(false);
    }
  };

  const handleShowCropper = (imageUrl: string) => {
    setImageUrl(imageUrl);
    setShowCropper(true); // "자르기" 버튼 클릭 시 cropper UI 표시
  };

  const sliderRef = useRef<HTMLDivElement | null>(null); // ref 생성
  const animationFrameRef = useRef<number | null>(null);
  const [position, setPosition] = useState<number>(0); // 초기 위치를 50%로 설정
  const [isDragging, setIsDragging] = useState<boolean>(false); // 드래그 상태 관리

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsDragging(true);
    handleDrag(e.nativeEvent); // 클릭 시 바로 위치 업데이트
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        handleDrag(e);
      });
      handleDrag(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDrag = (e: MouseEvent) => {
    if (!sliderRef.current) return;
    const sliderWidth = sliderRef.current.offsetWidth;
    const offsetX = e.clientX - sliderRef.current.getBoundingClientRect().left;
    const newPosition = Math.max(
      0,
      Math.min(100, (offsetX / sliderWidth) * 100),
    );
    setPosition(newPosition);
    setZoom(1 + newPosition / 50);
  };

  useEffect(() => {
    // 마우스 이동 이벤트 리스너 추가
    console.log(isDragging);
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    // 클린업 함수
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <PoseComposeBodyContainer>
        <ProfileScrapImgListWrap ref={postUploadListRef}>
          {postUploadContentList.map((value, k) => (
            <PostImgWrap key={k}>
              {value.contentType === POST_IMAGE_TYPE ? (
                <>
                  <PostUploadImg src={value.contentUrl} />
                  {!value.isLink && (
                    <PostImgCropButton
                      onClick={() => handleShowCropper(value.contentUrl)}
                    >
                      <PostImageCropButtonIcon />
                    </PostImgCropButton>
                  )}
                </>
              ) : (
                <>
                  <PostUploadVideo ref={videoRef} onEnded={handleVideoEnded}>
                    <source src={value.contentUrl} type="video/mp4" />
                  </PostUploadVideo>
                  <PostUploadVideoPlayButtonWrap onClick={handlePlayPauseVideo}>
                    {isPlaying ? (
                      <PostVideoPauseButtonIcon />
                    ) : (
                      <PostVideoPlayButtonIcon />
                    )}
                  </PostUploadVideoPlayButtonWrap>
                </>
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
                <PostEmptyImgWrap>
                  <PostEmptyImgSubWrap>
                    <PostComposeButtonIcon />
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
            placeholder={'게시물 문구를 작성하세요...'}
            onChange={(e) => setPostBodyText(e.target.value)}
            value={postBodyText}
          ></PostComposeDesc>
        </PostComposeDescWrap>

        <PostBottomLayoutContainer>
          <PostComposeBodyConatiner
            $bottomNextButtonHeight={bottomNextButtonHeight}
          >
            <PostComposeTagListContainer>
              <PostComposeTagListWrap ref={tagListRef}>
                {postTagList.map((value, key) => (
                  <PostComposeTagWrap key={key}>
                    <BorderCircleButton
                      className={ACTIVE_CLASS_NAME}
                      contentText={value}
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
                  contentText={'#태그 추가'}
                  deactiveBackgroundColor={theme.grey.Grey1}
                  deactiveBorderColor={theme.grey.Grey1}
                  deactiveFontColor={theme.grey.Grey8}
                  onClickFunc={() => setIsTagSearchPopupAtom(true)}
                />
              </PostComposeTagListWrap>
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
                      <AccountSettingArrowButtonIcon />
                    </PostComposeArrowButtonWrap>
                  </PostComposeElementWrap>
                </React.Fragment>
              ))}
            </PostComposeBodyWrap>
          </PostComposeBodyConatiner>

          <PostComposeButton
            title={composeButtonTitle}
            bottomNextButtonRef={bottomNextButtonRef}
            onClickActionFunc={onClickActionFunc}
            isActive={postUploadContentList.length > 0}
          />
        </PostBottomLayoutContainer>
      </PoseComposeBodyContainer>

      {isTagSearchPopup && (
        <TagSearchPopup tagList={postTagList} setTagList={setPostTagList} />
      )}
      {isActivPostComposeTargetAudiencePopup && (
        <PostComposeTargetAudiencePopup
          targetAudTabList={targetAudTabList}
          targetAudTabId={targetAudienceId}
          setTargetAudTabId={setTargetAudienceId}
        />
      )}
      {isActivePostComposeLocationPopup && (
        <PostComposeLocationPopup setAddress={setPoseComposeAddressRelation} />
      )}
      {showCropper && imageUrl && (
        <>
          <RoundSquareCenterPopupLayout
            setIsPopup={setShowCropper}
            popupWrapStyle={{ maxWidth: '550px', height: '80%' }}
          >
            <CropperContainer>
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </CropperContainer>
            <SliderContainer ref={sliderRef} onMouseDown={handleMouseDown}>
              <SliderBar />
              <SliderCircle $position={position} />
            </SliderContainer>

            <BottomNextButton
              title="이미지 수정"
              BottomNextButtonWrapContainerStyle={{
                position: 'static',
                backgroundColor: 'transparent',
              }}
              actionFunc={handleCropImage}
            />
          </RoundSquareCenterPopupLayout>
        </>
      )}

      {isLoadingPopup && <LoadingPopup />}
    </>
  );
};

const PoseComposeBodyContainer = styled.div`
  margin-top: 6px;
  position: fixed;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
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

const PostEmptyImgWrap = styled(PostSubImgWrap)`
  background-color: ${({ theme }) => theme.grey.Grey1};
  display: flex;
  cursor: pointer;
`;

const PostEmptyImgSubWrap = styled.div`
  display: flex;
  margin: auto;
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

const PostUploadVideoPlayButtonWrap = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0 0 5px 5px;
  cursor: pointer;
`;

const PostUploadVideo = styled.video`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3 / 4;
  border-radius: 8px;
  background-color: #000000;
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
    position: fixed;
    bottom: calc(${(props) => props.$bottomNextButtonHeight}px + 46px);
    width: 100%;
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth}
}`;

const PostComposeBodyWrap = styled.div``;

const PostComposeElementWrap = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const PostComposeArrowButtonWrap = styled.div`
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

export default PoseComposeBody;
