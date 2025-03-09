import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import PostSettingDotButton from 'components/common/buttton/PostSettingDotButton';
import { Location, PostRsp } from 'global/interface/post';
import React, { useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { masonryUpdateCountAtom } from 'states/MasonryAtom';
import styled from 'styled-components';
import { hoverFilterBrigntnessStyle } from 'styles/commonStyles';
import theme from 'styles/theme';
import PostElementLocation from './PostElementLocation';

interface PostImagePreviewELementProps {
  imageSrc: string;
  selectPostRsp: PostRsp;
  scrapId: string | undefined;
  PostImageStyle?: React.CSSProperties;
  actionFuncByRef?:
    | ((value: HTMLImageElement | HTMLVideoElement) => void)
    | undefined;

  onError: () => void;
  location: Location;
  ContentBorderRadius: number;
  longPressToResizeNum: number | undefined;
}

const PostImagePreviewElement: React.FC<PostImagePreviewELementProps> = ({
  imageSrc,
  selectPostRsp,
  scrapId,
  actionFuncByRef,
  PostImageStyle,
  onError,
  location,
  ContentBorderRadius,
  longPressToResizeNum,
}) => {
  const previewImageRef = useRef<HTMLImageElement>(null);

  const [onload, setOnload] = useState<boolean>(false);

  const setMasonryUpdateCount = useSetRecoilState(masonryUpdateCountAtom);

  return (
    <>
      <PostImgAddressWrap>
        <LongPressToResizeButton resize={longPressToResizeNum || 0.98}>
          <PostContentImgWrap>
            {!onload && (
              <PostContentMockImg
                style={{
                  ...PostImageStyle,
                  opacity: onload ? 0 : 1,
                  position: onload ? 'absolute' : 'relative',
                  transition: 'opacity 0.3s ease-in-out',
                }}
              />
            )}

            <PostContentImg
              src={imageSrc}
              onLoad={() => {
                setOnload(true);
                setTimeout(() => {
                  setMasonryUpdateCount((prev) => prev + 1);
                }, 50);
              }}
              ref={previewImageRef}
              style={{
                ...PostImageStyle,
                opacity: onload ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
              onClick={() => {
                if (!actionFuncByRef || !previewImageRef.current) return;
                actionFuncByRef(previewImageRef.current);
              }}
              onError={() => {
                onError();
              }}
              loading="lazy"
            />

            {onload && location.address && (
              <PostElementLocation
                location={location}
                ContentBorderRadius={ContentBorderRadius}
              />
            )}
          </PostContentImgWrap>
        </LongPressToResizeButton>
      </PostImgAddressWrap>

      <div
        style={{
          height: onload ? 'auto' : '25px',
        }}
      >
        {onload && (
          <PostSettingDotButton
            selectPostRsp={selectPostRsp}
            scrapId={scrapId}
          />
        )}
      </div>
    </>
  );
};

const PostImgAddressWrap = styled.div`
  position: relative;
  cursor: pointer;
  height: 100%;

  ${hoverFilterBrigntnessStyle}
`;

const PostContentImgWrap = styled.div`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
`;
const PostContentMockImg = styled.div`
  width: 100%;
  object-fit: contain;
  border-radius: 10px;
  background-color: ${theme.grey.Grey1};
  vertical-align: bottom;
  z-index: 10; /* 이미지보다 위에 위치 */
  transition: opacity 0.3s ease-in-out;
  aspect-ratio: 3 / 4;
`;

const PostContentImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  background-color: hsl(0, 0%, 97%);
  vertical-align: bottom;
  z-index: 100; /* 스켈레톤보다 위에 위치 */
  // position: relative;
  transition: opacity 0.3s ease-in-out;
`;

export default PostImagePreviewElement;
