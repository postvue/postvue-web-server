import React from 'react';
import PostPopupWrapper from './PostPopupWrapper';
import ProfilePopupWrapper from './ProfilePopupWrapper';

interface AppPopupWrapperProps {
  children: React.ReactNode;
}

const AppPopupWrapper: React.FC<AppPopupWrapperProps> = ({ children }) => {
  return (
    <div>
      <PostPopupWrapper>
        <ProfilePopupWrapper>{children}</ProfilePopupWrapper>
      </PostPopupWrapper>
    </div>
  );
};

export default AppPopupWrapper;
