import React, { useEffect, useMemo, useRef, useState } from 'react';
import Masonry, { breakPointColumns } from './Masonry';

type FetchMoreOption = {
  dataLength: number;

  threshold?: number;
  customLoader?: JSX.Element;
};

type MasonryLayoutProps = {
  children: React.ReactNode;
  columnGap?: number;
  rowGap?: number;
  breakPointOption?: breakPointColumns;
  fetchMoreOption: FetchMoreOption;
  MasonryLayoutStyle?: React.CSSProperties;
  fixNum?: number;
};

const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  children,
  columnGap = 10,
  rowGap = 5,
  breakPointOption = {
    default: 3,
    1200: 2,
    780: 2,
    300: 1,
  },
  fetchMoreOption,
  MasonryLayoutStyle,
  fixNum,
}) => {
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const option = useMemo(() => {
    return {
      threshold: 0,
      customLoader: null,
      ...fetchMoreOption,
    };
  }, [fetchMoreOption]);

  // infinity scrolling
  useEffect(() => {
    console.log('쿵');
    if (!fetchMoreOption) return;

    const scrollHandler = () => {
      const loadMoreEl = loadMoreRef.current;

      if (loadMoreEl) {
        // window sizes
        const wScrollTop = window.scrollY;
        const wHeight = window.innerHeight;
        const wScrollBottom = wScrollTop + wHeight;

        // loadMoreEl sizes
        const offsetTop = loadMoreEl.offsetTop;
        const height = loadMoreEl.clientHeight;
        let offsetBottom = offsetTop + height;

        if (option.threshold) {
          offsetBottom -= option.threshold;
        }

        if (!loading && wScrollBottom >= offsetBottom) {
          setLoading(true);
        }
      }
    };

    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [loading, option.threshold, option, fetchMoreOption]);

  useEffect(() => {
    setLoading(false);
  }, [option.dataLength]);

  return (
    <div id="masonry-layout" style={MasonryLayoutStyle}>
      <Masonry
        columnGap={columnGap}
        rowGap={rowGap}
        breakPointOption={breakPointOption}
        loadMoreRef={loadMoreRef}
        fixNum={fixNum}
      >
        {children}
      </Masonry>
      {loading &&
        (option.customLoader || (
          <h2 style={{ textAlign: 'center' }}>loading...</h2>
        ))}
    </div>
  );
};

export default MasonryLayout;
