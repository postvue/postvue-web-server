import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { PostUploadContent } from 'global/interface/post';
import { getCroppedImg, PixelCropType } from 'global/util/ImageInputUtil';
import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { SetterOrUpdater } from 'recoil';
import styled from 'styled-components';

interface PostComposeCropPopupBodyProps {
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setShowCropper: React.Dispatch<React.SetStateAction<boolean>>;
  setPostUploadContentList: SetterOrUpdater<PostUploadContent[]>;
}

const PostComposeCropPopupBody: React.FC<PostComposeCropPopupBodyProps> = ({
  imageUrl,
  setImageUrl,
  setShowCropper,
  setPostUploadContentList,
}) => {
  const sliderRef = useRef<HTMLDivElement | null>(null); // ref 생성
  const [position, setPosition] = useState<number>(0); // 초기 위치를 50%로 설정
  const [isDragging, setIsDragging] = useState<boolean>(false); // 드래그 상태 관리

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCropType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleDrag = (clientX: number) => {
    if (!sliderRef.current) return;
    const sliderWidth = sliderRef.current.offsetWidth;
    const offsetX = clientX - sliderRef.current.getBoundingClientRect().left;
    const newPosition = Math.max(
      0,
      Math.min(100, (offsetX / sliderWidth) * 100),
    );

    setPosition(newPosition);
    setZoom(1 + newPosition / 50);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleDrag(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleDrag(e.touches[0].clientX);
    }
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleTouchEnd = () => setIsDragging(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDrag(e.clientX);
  };
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (e.touches[0]) {
      handleDrag(e.touches[0].clientX);
    }
  };

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

  useEffect(() => {
    // 마우스 이동 이벤트 리스너 추가
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }

    // 클린업 함수
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const updateSliderPosition = (zoomLevel: number) => {
    const newPosition = Math.min(Math.max(0, (zoomLevel - 1) * 50), 100);
    setPosition(newPosition);
  };

  useEffect(() => {
    updateSliderPosition(zoom);
  }, [zoom]);
  return (
    <>
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
      <SliderContainer
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
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
    </>
  );
};

const CropperContainer = styled.div`
  position: relative;
  width: 95%;
  flex-grow: 1;
  margin: ${({ theme }) => theme.systemSize.header.heightNumber + 20}px auto 0
    auto;
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin: 20px auto 0 auto;
  }

  && > .reactEasyCrop_Container {
    border-radius: 20px;
    height: 500px;
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

export default PostComposeCropPopupBody;
