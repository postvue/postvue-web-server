import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import ProfileClipListInfiniteScroll from '../../hook/ProfileClipListInfiniteScroll';
import { myProfileClipListAtom } from '../../states/ProfileAtom';
import theme from '../../styles/theme';
import MasonryLayout from '../layouts/MasonryLayout';
const ProfileClipListBody: React.FC = () => {
  const myProfileClipList = useRecoilValue(myProfileClipListAtom);

  return (
    <ProfileClipBodyContainer>
      <MasonryLayout
        snsPostUrlList={myProfileClipList.map((v) => {
          return {
            postId: v.postId,
            userId: v.userId,
            postContent: v.postThumbnailImagePath,
            username: v.username,
          };
        })}
      />
      <ProfileClipListInfiniteScroll />
    </ProfileClipBodyContainer>
  );
};

const ProfileClipBodyContainer = styled.div`
  height: calc(100vh - 65px - ${theme.systemSize.bottomNavBar.height});
  overflow: scroll;
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default ProfileClipListBody;
