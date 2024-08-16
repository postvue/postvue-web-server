import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import PrevButton from '../PrevButton';
const ProfileMakeScrapHeader: React.FC = () => {
  return (
    <ProfileMakeScrapHeaderContainer>
      <ProfileMakeScrapHeaderWrap>
        <PrevButtonWrap>
          <PrevButton strokeColor={theme.mainColor.Black} />
        </PrevButtonWrap>
        <MakeScrapTitle>신규 스크랩 추가</MakeScrapTitle>
      </ProfileMakeScrapHeaderWrap>
    </ProfileMakeScrapHeaderContainer>
  );
};

const ProfileMakeScrapHeaderContainer = styled.div``;

const ProfileMakeScrapHeaderWrap = styled.div`
  display: flex;
  padding: 14px 0 12px 15px;
`;

const PrevButtonWrap = styled.div``;

const MakeScrapTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0%);
`;

export default ProfileMakeScrapHeader;
