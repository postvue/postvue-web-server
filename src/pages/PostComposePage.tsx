import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PoseComposeBody from 'components/posecompose/PoseComposeBody';
import PoseComposeHeader from 'components/posecompose/PoseComposeHeader';
import React from 'react';

const PostComposePage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <PoseComposeHeader />
      <PoseComposeBody />
    </AppBaseTemplate>
  );
};

export default PostComposePage;
