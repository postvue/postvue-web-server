import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import PullToRefresh from './lib/pulltorefresh/pull-to-refresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<any>;
  children: React.ReactNode;
  onUnmount?: () => void;
}

const PullToRefreshComponent: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
}) => {
  return (
    <PullToRefresh
      onRefresh={onRefresh}
      resistance={3}
      refreshTimeout={100}
      pullingContent={
        <FontAwesomeIcon
          style={{ margin: '0 auto', display: 'flex', marginTop: '20px' }}
          icon={faArrowDown}
          size="lg"
        />
      }
    >
      {children as React.ReactElement}
    </PullToRefresh>
  );
};

export default PullToRefreshComponent;
