import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface PostZoomImageProps {
  src: string;
  isMobile: boolean;
}

const PostZoomImage: React.FC<PostZoomImageProps> = ({ src, isMobile }) => {
  const { windowWidth, windowHeight } = useWindowSize();
  const PostImgRef = useRef<HTMLImageElement>(null);

  const [postImgStyle, setPostImgStyle] = useState({
    width: 'auto',
    height: 'auto',
  });

  const [imgDisplay, setImgDisplay] = useState<boolean>(false);

  useEffect(() => {
    // 포스터 크기 가져오기
    const postImg = PostImgRef.current;

    if (postImg) {
      const updateVideoStyle = () => {
        let width;
        let height;

        if (isMobile) {
          const heightRatio = postImg.height / postImg.width;
          const widthRatio = 1;
          const widthSize =
            windowWidth < theme.systemSize.appDisplaySize.maxWidthNum
              ? windowWidth
              : theme.systemSize.appDisplaySize.maxWidthNum;

          const tempHeight = Math.round(widthSize * heightRatio);

          const ratio =
            tempHeight >= window.innerHeight
              ? (window.innerHeight / tempHeight) * (8 / 9)
              : 1;

          width = `${Math.round(widthSize * widthRatio * ratio)}px`;
          height = `${Math.round(widthSize * heightRatio * ratio)}px`;
        } else {
          const heightRatio = 1;
          const widthRatio = postImg.width / postImg.height;
          const widthSize = (windowHeight * 9) / 10;

          width = `${Math.round(widthSize * widthRatio)}px`;
          height = `${Math.round(widthSize * heightRatio)}px`;
        }

        if (postImgStyle.height === height && postImgStyle.width === width)
          return;
        setPostImgStyle({
          width: width,
          height: height,
        });
        setImgDisplay(true);
      };

      // 이미지가 로드된 후 크기를 설정
      if (postImg.complete) {
        updateVideoStyle();
      } else {
        postImg.onload = updateVideoStyle;
      }
    }
  }, [windowWidth]);

  return (
    <PostImage
      ref={PostImgRef}
      src={src}
      $isDisplay={imgDisplay}
      onClick={(e) => e.stopPropagation()}
      style={postImgStyle}
    />
  );
};

const PostImage = styled.img<{ $isDisplay: boolean }>`
  border-radius: 10px;
  background-color: hsl(0, 0%, 97%);
  width: 100%;
  height: 100%;
  vertical-align: bottom;
`;

export default PostZoomImage;
