import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import React from 'react';
import { useParams } from 'react-router-dom';

const ProfileFollowListHeader: React.FC = () => {
  const params = useParams();

  const username = params.username || '계정';
  return <PrevButtonHeaderHeader titleName={username} />;
};

export default ProfileFollowListHeader;
