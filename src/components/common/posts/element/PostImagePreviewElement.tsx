import React, { useRef } from 'react';
import styled from 'styled-components';

interface PostImagePreviewELementProps {
  onLoad?: React.ReactEventHandler<HTMLImageElement> | undefined;
  imageSrc: string;
  PostImageStyle?: React.CSSProperties;
  actionFuncByRef?:
    | ((value: HTMLImageElement | HTMLVideoElement) => void)
    | undefined;

  onError: () => void;
}

const PostImagePreviewElement: React.FC<PostImagePreviewELementProps> = ({
  onLoad,
  imageSrc,
  actionFuncByRef,
  PostImageStyle,
  onError,
}) => {
  const previewImageRef = useRef<HTMLImageElement>(null);

  return (
    <PostContentImg
      src={imageSrc}
      onLoad={onLoad}
      ref={previewImageRef}
      style={PostImageStyle}
      onClick={() => {
        if (!actionFuncByRef || !previewImageRef.current) return;
        actionFuncByRef(previewImageRef.current);
      }}
      onError={() => {
        onError();
      }}
      loading="lazy"
    />
  );
};

const PostContentImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  background-color: hsl(0, 0%, 97%);
  vertical-align: bottom;
`;

export default PostImagePreviewElement;
