import { PostRsp } from 'global/interface/post';
import React, { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  InfiniteLoader,
  Masonry,
  MasonryCellProps,
  WindowScroller,
} from 'react-virtualized';
import styled from 'styled-components';
import { PostItem } from './Grid';

type MasonryInfiniteGridProps = {
  itemsWithSizes: PostItem[];
  hasMore: boolean;
  loadMore: () => void;

  masonryWidth: number;
  columnNum: number;
  returnPostMasonryItem: (imageUrl: string, postRsp: PostRsp) => JSX.Element;

  onClickMasonry?: (post: PostRsp) => void;
  scrollElement?: Element;
  inViewElement?: React.ReactNode;
  contentBorderRadius?: number;
};

const GUTTER_SIZE = 0;

const MasonryInfiniteGrid: React.FC<MasonryInfiniteGridProps> = ({
  itemsWithSizes,
  hasMore,
  loadMore,
  masonryWidth,
  columnNum,
  onClickMasonry,
  scrollElement,
  inViewElement,
  returnPostMasonryItem,
  contentBorderRadius = 20,
}) => {
  const masonryRef = useRef<Masonry | null>(null);

  const CARD_WIDTH = Math.floor(masonryWidth / columnNum);
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 250,
      defaultWidth: CARD_WIDTH,
    }),
  );
  const cellPositioner = useRef<any>(null);
  const [columnCount, setColumnCount] = useState(1);

  const getColumnCount = (width: number) =>
    Math.floor(width / (CARD_WIDTH + GUTTER_SIZE));

  const cellPositionerConfig = {
    cellMeasurerCache: cache.current,
    columnCount: columnNum,
    columnWidth: CARD_WIDTH,
    spacer: GUTTER_SIZE,
  };

  const initCellPositioner = (width: number) => {
    const count = getColumnCount(width);
    setColumnCount(count);
    cellPositioner.current = createMasonryCellPositioner(cellPositionerConfig);
  };

  const resetCellPositioner = (width: number) => {
    const count = getColumnCount(width);
    setColumnCount(count);
    cellPositioner.current.reset({
      columnCount: count,
      columnWidth: CARD_WIDTH,
      spacer: GUTTER_SIZE,
    });
  };

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!itemsWithSizes[index];
  };
  const navigate = useNavigate();

  const cellRenderer = ({ index, key, parent, style }: MasonryCellProps) => {
    const data = itemsWithSizes[index];
    if (!data) return null;

    const { image, postRsp, size } = data;
    const aspectRatio = size.height / size.width;
    const dynamicHeight = CARD_WIDTH * aspectRatio;

    return (
      <CellMeasurer
        cache={cache.current}
        index={index}
        key={key}
        parent={parent}
      >
        <div
          style={{ ...style, width: CARD_WIDTH, height: dynamicHeight + 40 }}
        >
          <div
            style={{
              padding: 5,
              height: dynamicHeight,
            }}
            onClick={() => {
              if (!onClickMasonry) return;
              onClickMasonry(postRsp);
            }}
          >
            <>{returnPostMasonryItem(image, postRsp)}</>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  const renderMasonry =
    (
      registerChild: any,
      onRowsRendered: any,
      height: number,
      scrollTop: number,
    ) =>
    // eslint-disable-next-line react/display-name
    ({ width }: { width: number }) => {
      if (!cellPositioner.current) initCellPositioner(width);

      return (
        <Masonry
          ref={(ref) => {
            masonryRef.current = ref;
            registerChild(ref);
          }}
          scr
          cellCount={itemsWithSizes.length}
          cellMeasurerCache={cache.current}
          cellRenderer={cellRenderer}
          cellPositioner={cellPositioner.current}
          autoHeight
          height={height}
          width={width}
          scrollTop={scrollTop}
          overscanByPixels={100}
          onCellsRendered={onRowsRendered}
        />
      );
    };

  const renderAutoSizer =
    () =>
    // eslint-disable-next-line react/display-name
    ({
      registerChild,
      onRowsRendered,
    }: {
      registerChild: any;
      onRowsRendered: any;
    }) => {
      return (
        <WindowScroller overscanByPixels={100} scrollElement={scrollElement}>
          {({ height, scrollTop }) => (
            <AutoSizer disableHeight>
              {renderMasonry(registerChild, onRowsRendered, height, scrollTop)}
            </AutoSizer>
          )}
        </WindowScroller>
      );
    };

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current != null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      cache.current.clearAll();
      cellPositioner.current.reset(cellPositionerConfig);
      masonryRef.current?.clearCellPositions();
    }, 50);
  }, [
    itemsWithSizes
      .slice(0, 10)
      .map((value) => value.postRsp.postId)
      .join('_'),
    masonryWidth,
  ]);

  return (
    <>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={async ({ startIndex, stopIndex }) => {
          await loadMore();
        }}
        rowCount={hasMore ? itemsWithSizes.length + 1 : itemsWithSizes.length}
        threshold={5}
      >
        {renderAutoSizer()}
      </InfiniteLoader>
      {itemsWithSizes.length <= 0 && (
        <FavoriteTagSuggestItemListWrap>
          {_MOCK_LIST.map((v, index) => {
            return (
              <TagElementContainer key={index}>
                <Skeleton
                  style={{
                    borderRadius: contentBorderRadius,
                    aspectRatio: ASPECT_RATIO,
                  }}
                />
              </TagElementContainer>
            );
          })}
        </FavoriteTagSuggestItemListWrap>
      )}
      {inViewElement}
    </>
  );
};

const _MOCK_LIST = Array(30).fill(0);

const ASPECT_RATIO = '3/4';

const TagElementContainer = styled.div`
  cursor: pointer;
  position: relative;
`;

const FavoriteTagSuggestItemListWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 10px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
    0px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

export default MasonryInfiniteGrid;
