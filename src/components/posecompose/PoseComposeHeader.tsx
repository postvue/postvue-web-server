import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import React from 'react';

interface PoseComposeHeaderProps {
  titleName: string;
}

const PoseComposeHeader: React.FC<PoseComposeHeaderProps> = ({ titleName }) => {
  return (
    <>
      <PrevButtonHeaderHeader titleName={titleName} />
    </>
  );
};

export default PoseComposeHeader;
