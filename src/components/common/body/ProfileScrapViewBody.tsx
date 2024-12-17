import ProfileScrapListInfiniteScroll from 'hook/ProfileScrapListInfiniteScroll';
import { QueryStateProfileScrapList } from 'hook/queryhook/QueryStateProfileScrapList';
import React from 'react';
import styled from 'styled-components';
import theme from '../../../styles/theme';
import ProfileScrapThumbnailListView from './ProfileScrapThumbnailListView';

interface ProfileScrapListBodyProps {
  profileScrapViewRef?: React.RefObject<HTMLDivElement>;
  onButtonEvent: (scrapId: string) => void;
  mainContainerStyle?: React.CSSProperties;
  isAddMove?: boolean;
  scrapIdList?: string[];
}

const ProfileScrapViewBody: React.FC<ProfileScrapListBodyProps> = ({
  profileScrapViewRef,
  onButtonEvent,
  mainContainerStyle,
  isAddMove = false,
  scrapIdList,
}) => {
  const { data } = QueryStateProfileScrapList();

  return (
    <ProfileShowProfileScrapViewBodyContainer
      ref={profileScrapViewRef}
      style={mainContainerStyle}
    >
      {data && (
        <ProfileScrapThumbnailListView
          profileThumbnailScrapList={data?.pages.flatMap((value) => value)}
          isAddMove={isAddMove}
          scrapIdList={scrapIdList}
          onButtonEvent={onButtonEvent}
        />
      )}
      {data && data?.pages.flatMap((value) => value).length <= 0 && (
        <NotScrapTitle>아직 저장한 스크랩이 없네요... 😢</NotScrapTitle>
      )}

      <ProfileScrapListInfiniteScroll />
    </ProfileShowProfileScrapViewBodyContainer>
  );
};

const ProfileShowProfileScrapViewBodyContainer = styled.div`
  // height: calc(100vh - 65px - ${theme.systemSize.bottomNavBar.height});
  // overflow: scroll;
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  padding-top: 20px;
`;

const NotScrapTitle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

export default ProfileScrapViewBody;
