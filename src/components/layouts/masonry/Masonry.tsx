import MasonryUtil from 'global/util/MasonryUtil';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  masonryColumnCountAtom,
  masonryUpdateCountAtom,
} from 'states/MasonryAtom';
import MasonryBrick from './MasonryBrick';
import MasonryBrickWrap from './MasonryBrickWrap';
import MasonryContainer from './MasonryContainer';

export interface breakPointColumns {
  [key: number | string]: number;
}

type MasonryProps = {
  children: React.ReactNode;
  columnGap: number;
  rowGap: number;
  breakPointOption: breakPointColumns;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  fixNum?: number;
};

const Masonry: React.FC<MasonryProps> = ({
  children,
  columnGap,
  rowGap,
  breakPointOption,
  loadMoreRef,
  fixNum,
}) => {
  const [columnCount, setColumnCount] = useRecoilState(masonryColumnCountAtom);
  const [columnWidth, setColumnWidth] = useState(2);
  const [reload, setReload] = useState(0);
  const masonryUpdateCount = useRecoilValue(masonryUpdateCountAtom);

  const masonryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const brickRefs: React.RefObject<HTMLDivElement>[] = useMemo(() => [], []);
  const wrapRefs: React.RefObject<HTMLDivElement>[] = useMemo(() => [], []);

  const utils = useMemo(() => new MasonryUtil(), []);

  // 칼럼 개수 설정
  useEffect(() => {
    const resizeHandler = () => {
      // 윈도우 너비
      const wWidth = window.innerWidth;
      setColumnCount(
        utils.caculateColumnCount(wWidth, breakPointOption, fixNum),
      );
    };

    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [breakPointOption, utils]);

  // 반응형 너비
  useEffect(() => {
    if (!columnCount) return;

    const resizeHandler = () => {
      if (masonryRef.current) {
        const scrollBarWidth = 0; // 스크롤바 너비
        const lWidth =
          parseInt(
            window
              .getComputedStyle(masonryRef.current)
              .getPropertyValue('width'),
          ) - scrollBarWidth || 0; // layout 너비
        const cWidth = lWidth / columnCount; // 칼럼 너비
        setColumnWidth(cWidth);
      }
    };

    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [masonryRef, columnCount]);

  // Wrap 컴포넌트 설정
  useEffect(() => {
    wrapRefs.forEach((el) => {
      const wrapEl = el.current;

      if (wrapEl) {
        wrapEl.style.paddingLeft = columnGap / 2 + 'px';
        wrapEl.style.paddingRight = columnGap / 2 + 'px';
        wrapEl.style.paddingBottom = rowGap + 'px';
      }
    });
  }, [wrapRefs, columnGap, rowGap, children]);

  // Brick 컴포넌트 설정
  useEffect(() => {
    brickRefs.forEach((el, index) => {
      const brickEl = el.current;
      const wrapEl = wrapRefs[index].current;
      const cellWidth = columnWidth;

      // 이미지가 있다면 이미지 로딩 후, reload를 업데이트함으로써 Brick 컴포넌트 설정 및 배치
      if (brickEl && wrapEl) {
        const imgEl = wrapEl.querySelector('img');

        // const videoEl = wrapEl.querySelector('video');

        if (imgEl) {
          imgEl.addEventListener('load', () => {
            applyBrickStyles(brickEl, wrapEl, cellWidth);
            setReload((prev) => prev + 1);
          });
        }

        //@REFER: 비디오 자동 실행 구현 완료시
        // if (videoEl) {
        //   videoEl.addEventListener('loadedmetadata', () => {
        //     applyBrickStyles(brickEl, wrapEl, cellWidth);
        //     setReload((prev) => prev + 1);
        //   });
        // }

        // 기본 스타일 설정
        applyBrickStyles(brickEl, wrapEl, cellWidth);
      }
    });
  }, [
    brickRefs,
    wrapRefs,
    columnWidth,
    columnGap,
    children,
    masonryUpdateCount,
  ]);

  // 스타일 적용 함수
  const applyBrickStyles = (
    brickEl: HTMLDivElement,
    wrapEl: HTMLDivElement,
    cellWidth: number,
  ) => {
    brickEl.style.width = `${cellWidth}px`;
    brickEl.style.height = `${wrapEl.clientHeight}px`;
    brickEl.style.position = 'absolute';
    brickEl.style.left = '0px';
    brickEl.style.top = '0px';
  };

  // Container 컴포넌트 설정
  useEffect(() => {
    const containerEl = containerRef.current;

    if (containerEl) {
      containerEl.style.position = 'relative';
    }
  }, []);

  useEffect(() => {
    const rowPos = Array(columnCount).fill(0);
    const columnPos = Array(columnCount).fill(0);
    const cellWidth = columnWidth;

    rowPos.forEach((_, index) => (rowPos[index] = cellWidth * index));

    // Brick 컴포넌트 배치하기
    brickRefs.forEach((el) => {
      const brickEl = el.current;
      const minIndex = columnPos.findIndex(
        (v) => v === Math.min.apply(null, columnPos),
      );

      const posX = rowPos[minIndex];
      const posY = columnPos[minIndex];

      if (brickEl) {
        brickEl.style.transform =
          'translateX(' + posX + 'px) translateY(' + posY + 'px)';

        columnPos[minIndex] += brickEl?.clientHeight;
      }
    });

    // Container 컴포넌트 크기 설정
    const containerEl = containerRef.current;
    if (containerEl) {
      const containerWidth = cellWidth * columnCount;
      const containerHeight = Math.max.apply(null, columnPos);

      containerEl.style.width = containerWidth + 'px';
      containerEl.style.height = containerHeight + 'px';
    }
  }, [
    columnCount,
    containerRef,
    brickRefs,
    columnWidth,
    columnGap,
    children,
    reload,
    masonryUpdateCount,
  ]);

  return (
    <div id="masonry" ref={masonryRef}>
      <div id="masonry-wrap" ref={loadMoreRef}>
        <MasonryContainer containerRef={containerRef}>
          {React.Children.map(children, (child, index) => {
            return (
              <MasonryBrick key={index} brickRefs={brickRefs}>
                <MasonryBrickWrap wrapRefs={wrapRefs}>{child}</MasonryBrickWrap>
              </MasonryBrick>
            );
          })}
        </MasonryContainer>
      </div>
    </div>
  );
};

export default Masonry;
