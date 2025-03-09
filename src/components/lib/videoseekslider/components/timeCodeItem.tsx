/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import styled from 'styled-components';
import { getPositionPercent } from '../utils/getPositionPercent';
import { getTimeScale } from '../utils/getTimeScale';

export interface TimeCode {
  fromMs: number;
  description: string;
}

export interface Props {
  currentTime: number;
  seekHoverTime: number;
  bufferTime: number;
  startTime: number;
  endTime: number;
  maxTime: number;
  label?: string;
  isTimePassed?: boolean;
  isBufferPassed?: boolean;
  isHoverPassed?: boolean;
  onHover?: (label: string) => void;
  withGap?: boolean;
}

const TimeCodeItem: React.FC<Props> =
  // eslint-disable-next-line react/display-name
  React.memo(
    ({
      // eslint-disable-next-line react/prop-types
      label = '',
      startTime,
      maxTime,
      endTime,
      currentTime,
      seekHoverTime,
      bufferTime,
      isTimePassed = false,
      isBufferPassed = false,
      isHoverPassed = false,
      onHover = () => undefined,
      withGap,
    }) => {
      const positionPercent = getPositionPercent(maxTime, startTime);
      const timeDiff = endTime - startTime;
      const widthPercent = (timeDiff / maxTime) * 100;
      const mainClassName = `main${withGap ? ' with-gap' : ''}`;

      const currentTimeScale = getTimeScale(
        currentTime,
        startTime,
        endTime,
        isTimePassed,
      );

      const seekHoverTimeScale = getTimeScale(
        seekHoverTime,
        startTime,
        endTime,
        isHoverPassed,
      );

      const bufferTimeScale = getTimeScale(
        bufferTime,
        startTime,
        endTime,
        isBufferPassed,
      );

      const handleMouseMove = (): void => onHover(label);

      const SquareRef = useRef<HTMLDivElement>(null);

      return (
        <div
          className={mainClassName}
          onMouseMove={handleMouseMove}
          style={{
            width: `${widthPercent}%`,
            left: `${positionPercent}%`,
          }}
        >
          <Square ref={SquareRef} className="seek-square-buffer">
            <Left className="left-seek-buffer" />
            <div
              className="inner-seek-block buffered"
              data-test-id="test-buffered"
              style={{
                transformOrigin: 'left',
                width: '1px',
                left: `${sideWidthSize}px`,
                transform: `scaleX(${Math.max(0, bufferTimeScale * (SquareRef.current?.clientWidth || 0) - sideWidthSize)})`,
                position: 'absolute',
              }}
            />
            <Right
              className="right-seek-buffer"
              style={{
                transform: `translateX(${Math.max(0, bufferTimeScale * (SquareRef.current?.clientWidth || 0) - sideWidthSize)}px)`,
              }}
            />
          </Square>

          <Square ref={SquareRef} className="seek-square-hover">
            <Left className="left-seek-hover" />
            <div
              className="inner-seek-block seek-hover"
              data-test-id="test-seek-hover"
              style={{
                transformOrigin: 'left',
                width: '1px',
                left: `${sideWidthSize}px`,
                transform: `scaleX(${Math.max(0, seekHoverTimeScale * (SquareRef.current?.clientWidth || 0) - sideWidthSize)})`,
                position: 'absolute',
              }}
            />
            <Right
              className="right-seek-hover"
              style={{
                transform: `translateX(${Math.max(0, seekHoverTimeScale * (SquareRef.current?.clientWidth || 0) - sideWidthSize)}px)`,
              }}
            />
          </Square>

          <Square ref={SquareRef} className="seek-square-block">
            <Left className="left-seek-block" />
            <div
              className="inner-seek-block connect"
              style={{
                transformOrigin: 'left',
                width: '1px',
                left: `${sideWidthSize}px`,
                transform: `scaleX(${Math.max(0, currentTimeScale * (SquareRef.current?.clientWidth || 0) - sideWidthSize)})`,
              }}
            ></div>
            <Right
              className="right-seek-block"
              style={{
                transform: `translateX(${Math.max(0, currentTimeScale * (SquareRef.current?.clientWidth || 0) - sideWidthSize)}px)`,
              }}
            />
          </Square>
        </div>
      );
    },
  );

const sideWidthSize = 5;

const Square = styled.div`
  height: 8px;
  width: 100%;
`;

const SideArea = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: ${sideWidthSize}px;
`;

const Left = styled(SideArea)`
  border-radius: 20px 0 0 20px;
`;
const Right = styled(SideArea)`
  left: ${sideWidthSize}px;
  border-radius: 0 20px 20px 0;
`;
export default TimeCodeItem;
