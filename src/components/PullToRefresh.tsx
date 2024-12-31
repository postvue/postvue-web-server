import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => void;
  maxDistance: number;
  loadingComponent: ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  maxDistance,
  loadingComponent,
}) => {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const [pulled, setPulled] = useState(false);

  useEffect(() => {
    const touchMoveListener = (e: TouchEvent) => {
      if (isTouch && pulled) {
        onMove(e.touches[0].clientY);
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', touchMoveListener, {
      passive: false,
    });

    return () => {
      document.removeEventListener('touchmove', touchMoveListener);
    };
  }, [isTouch, pulled]);

  const resetToInitial = () => {
    if (spinnerRef.current) {
      spinnerRef.current.style.height = '0';
      spinnerRef.current.style.willChange = 'unset';
    }
    setPulled(false);
    setIsRefreshing(false);
  };

  const onStart = (y: number, touch: boolean) => {
    setStartY(y);
    setIsTouch(touch);
    setPulled(true);
    if (spinnerRef.current) {
      spinnerRef.current.style.willChange = 'height';
    }
  };

  const onMove = (y: number) => {
    if (pulled && spinnerRef.current) {
      const moveY = y;
      const pulledDistance = Math.min(
        Math.pow(moveY - startY, 0.875),
        maxDistance,
      );

      if (pulledDistance > 0) {
        spinnerRef.current.style.height = `${pulledDistance}px`;

        // 맨 위에서만 스크롤 차단
        if (window.scrollY <= 0 && pulledDistance >= 10) {
          preventBodyScroll();
        }

        if (pulledDistance >= maxDistance) {
          setIsRefreshing(true);
        } else {
          setIsRefreshing(false);
        }
      } else {
        resetToInitial();
      }
    }
  };

  const handleEnd = () => {
    if (isTouch && pulled) {
      onEnd();
    }
  };
  const onEnd = async () => {
    if (pulled) {
      ableBodyScroll();
      if (isRefreshing) {
        try {
          await onRefresh();
          await new Promise((resolve) => {
            setTimeout(resolve, 500); // 최대 1초까지 기다림
          });
          resetToInitial();
        } catch (error) {
          console.error('Error while refreshing:', error);
        }
      } else {
        resetToInitial();
      }
    }
  };

  const ableBodyScroll = () => {
    document.body.style.overflow = 'auto';
  };

  const preventBodyScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // 맨 위에서만 PullToRefresh 동작 시작
    if (window.scrollY === 0) {
      onStart(e.touches[0].clientY, true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // 맨 위에서만 PullToRefresh 동작 시작
    if (window.scrollY === 0) {
      onStart(e.clientY, false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isTouch && pulled) {
      onMove(e.clientY);
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    if (!isTouch) {
      onEnd();
    }
  };

  return (
    <div>
      <div ref={spinnerRef}>{isRefreshing && loadingComponent}</div>
      <div
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleEnd}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
