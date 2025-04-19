import { PostRsp } from 'global/interface/post';
import React, { useEffect, useState } from 'react';

type Item = {
  image: string;
  postRsp: PostRsp;
};

type Size = {
  width: number;
  height: number;
};

type SizesMap = {
  [index: number]: Size;
};

type ImageMeasurerProps = {
  items: Item[];
  onSizeCalculated: (sizes: SizesMap) => void;
  children: (sizes: SizesMap) => React.ReactNode;
};

const ImageMeasurer: React.FC<ImageMeasurerProps> = ({
  items,
  onSizeCalculated,
  children,
}) => {
  const [sizes, setSizes] = useState<SizesMap>({});

  useEffect(() => {
    const sizes: SizesMap = {};
    let loadedImages = 0;

    items.forEach((item, index) => {
      const img = new Image();
      img.src = item.image;

      img.onload = () => {
        sizes[index] = {
          width: img.width,
          height: img.height,
        };
        loadedImages += 1;

        if (loadedImages === items.length) {
          setSizes(sizes);
          onSizeCalculated(sizes);
        }
      };

      img.onerror = (error) => {
        console.error(
          'Cannot load image',
          img.src,
          'for item',
          item,
          'error',
          error,
        );
      };
    });
  }, [items, onSizeCalculated]);

  return <>{children(sizes)}</>;
};

export default ImageMeasurer;
