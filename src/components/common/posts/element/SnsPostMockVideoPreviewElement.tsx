import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import PostSettingDotButtonV2 from 'components/common/buttton/PostSettingDotButtonV2';
import { Location, PostRsp } from 'global/interface/post';
import { formatToMinutesAndSeconds } from 'global/util/DateTimeUtil';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { hoverFilterBrigntnessStyle } from 'styles/commonStyles';
import PostElementLocation from './PostElementLocation';

interface SnsPostMockVideoPreviewElementProps {
  imageSrc: string;
  selectPostRsp: PostRsp;
  scrapId: string | undefined;
  PostImageStyle?: React.CSSProperties;
  actionFuncByRef?:
    | ((value: HTMLImageElement | HTMLVideoElement) => void)
    | undefined;

  location: Location;
  ContentBorderRadius: number;
  videoDuration: number;
  longPressToResizeNum: number | undefined;
}

const SnsPostMockVideoPreviewElement: React.FC<
  SnsPostMockVideoPreviewElementProps
> = ({
  imageSrc,
  selectPostRsp,
  scrapId,
  actionFuncByRef,
  PostImageStyle,
  location,
  ContentBorderRadius,
  videoDuration,
  longPressToResizeNum,
}) => {
  const previewImageRef = useRef<HTMLImageElement>(null);

  return (
    <>
      <PostImgAddressWrap>
        <LongPressToResizeButton resize={longPressToResizeNum || 0.98}>
          <PostContentImgWrap>
            <VideoDurationWrap>
              <VideoDurationElement>
                {formatToMinutesAndSeconds(videoDuration)}
              </VideoDurationElement>
            </VideoDurationWrap>
            <PostContentImg
              src={imageSrc}
              ref={previewImageRef}
              style={{
                ...PostImageStyle,
                // opacity: onload ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
              onClick={() => {
                if (!actionFuncByRef || !previewImageRef.current) return;
                actionFuncByRef(previewImageRef.current);
              }}
              loading="lazy"
            />

            {(location.address || location.buildName) && (
              <PostElementLocation
                location={location}
                ContentBorderRadius={ContentBorderRadius}
              />
            )}
          </PostContentImgWrap>
        </LongPressToResizeButton>
      </PostImgAddressWrap>

      <PostSettingDotButtonV2 selectPostRsp={selectPostRsp} scrapId={scrapId} />
    </>
  );
};

const PostImgAddressWrap = styled.div`
  cursor: pointer;
  width: 100%;
  height: calc(100% - 20px);
  position: relative;

  ${hoverFilterBrigntnessStyle}
`;

const PostContentImgWrap = styled.div`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const PostContentImg = styled.img`
  width: 100%;
  height: 100%;
  // object-fit: contain;
  border-radius: 10px;
  background-color: hsl(0, 0%, 97%);
  vertical-align: bottom;
  z-index: 100; /* 스켈레톤보다 위에 위치 */
  transition: opacity 0.3s ease-in-out;
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

export default SnsPostMockVideoPreviewElement;
