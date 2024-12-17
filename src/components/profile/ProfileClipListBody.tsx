import ProfileClipListInfiniteScroll from 'hook/ProfileClipListInfiniteScroll';
import React from 'react';
import styled from 'styled-components';

import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import { QueryStateProfileClipListInfinite } from 'hook/queryhook/QueryStateProfileClipListInfinite';
import theme from '../../styles/theme';
const ProfileClipListBody: React.FC = () => {
  const { data: myProfileClipList } = QueryStateProfileClipListInfinite();

  return (
    <ProfileClipBodyContainer>
      {myProfileClipList && (
        <SnsPostMasonryLayout
          snsPostList={myProfileClipList?.pages.flatMap((v) =>
            v.snsPostRspList.map((value) => value),
          )}
        />
      )}
      {myProfileClipList &&
        myProfileClipList?.pages.flatMap((v) => v.snsPostRspList).length <=
          0 && (
          <ProifileNotClipTitleWrap>
            <ProifileNotClipTitle>
              아직 저장한 클립이 없네요... 😢
            </ProifileNotClipTitle>
          </ProifileNotClipTitleWrap>
        )}

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

const ProifileNotClipTitleWrap = styled.div`
  display: flex;
`;

const ProifileNotClipTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default ProfileClipListBody;
