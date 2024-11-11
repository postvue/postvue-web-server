import { MasonryPostRsp } from 'global/interface/post';
import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import ProfileClipListInfiniteScroll from '../../hook/ProfileClipListInfiniteScroll';
import { myProfileClipHashMapAtom } from '../../states/ProfileAtom';
import theme from '../../styles/theme';
import MasonryLayout from '../layouts/MasonryLayout';
const ProfileClipListBody: React.FC = () => {
  const myProfileClipHashMap = useRecoilValue(myProfileClipHashMapAtom);

  return (
    <ProfileClipBodyContainer>
      <MasonryLayout
        snsPostUrlList={Array.from(myProfileClipHashMap.entries()).map(
          ([, v]) => {
            const homePostRsp: MasonryPostRsp = {
              postId: v.postId,
              userId: v.userId,
              postContent: v.postThumbnailContent,
              postContentType: v.postThumbnailContentType,
              username: v.username,
              location: v.location,
            };

            return homePostRsp;
          },
        )}
      />
      <ProfileClipListInfiniteScroll />
    </ProfileClipBodyContainer>
  );
};

const ProfileClipBodyContainer = styled.div`
  padding-top: 10px;
  // height: calc(100vh - 65px - ${theme.systemSize.bottomNavBar.height});
  // overflow: scroll;
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default ProfileClipListBody;
