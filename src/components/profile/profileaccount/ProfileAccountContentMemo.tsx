import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ProfileScrapImgWrapProps {
  children: ReactNode;
}

// eslint-disable-next-line react/display-name
const ProfileAccountContentMemo: React.FC<ProfileScrapImgWrapProps> =
  // eslint-disable-next-line react/display-name
  React.memo(
    // eslint-disable-next-line react/prop-types
    ({ children }) => {
      return (
        <div
          className="profile-scrap-img-wrap"
          style={{ minWidth: '60%', maxWidth: '60%' }}
        >
          {children}
        </div>
      );
    },
  );

const ProfileAccountContentMemoContainer = styled.div`
  min-width: 300px;

  cursor: pointer;
`;

export default ProfileAccountContentMemo;
