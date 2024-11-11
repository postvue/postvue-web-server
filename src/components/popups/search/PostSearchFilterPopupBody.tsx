import { ReactComponent as ScrapComposeTargetAudTabIcon } from 'assets/images/icon/svg/CategoryCheckIcon.svg';
import { ReactComponent as ScrapComposeTargetAudNotActiveTabIcon } from 'assets/images/icon/svg/CategoryNotCheckIcon.svg';
import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import { SEARCH_POST_PATH } from 'const/PathConst';
import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface PostSearchFilterPopupBodyProps {
  searchWord: string;
}

const PostSearchFilterPopupBody: React.FC<PostSearchFilterPopupBodyProps> = ({
  searchWord,
}) => {
  const filterInfoList = [
    { name: '게시글', url: SEARCH_POST_PATH },
    { name: '스크랩', url: '/search/scraps' },
    { name: '프로필', url: '/search/profiles' },
  ];

  const location = useLocation();

  return (
    <PostSearchFilterPopupContainer>
      <PostSearchFilterTitle>검색 필터</PostSearchFilterTitle>
      <PostSearchFilterPopupWrap>
        {filterInfoList.map((value, key) => {
          return (
            <ProfileScrapTargetWrap key={key}>
              <ProfileScrapTargetAudienceTab>
                {value.name}
              </ProfileScrapTargetAudienceTab>

              <ProfileScrapTargetAudTabWrap>
                {location.pathname.startsWith(value.url) ? (
                  <ScrapComposeTargetAudTabIcon />
                ) : (
                  <ScrapComposeTargetAudNotActiveTabIcon />
                )}
              </ProfileScrapTargetAudTabWrap>
            </ProfileScrapTargetWrap>
          );
        })}
      </PostSearchFilterPopupWrap>
      <MyAccountSettingInfoState />
    </PostSearchFilterPopupContainer>
  );
};

const PostSearchFilterPopupContainer = styled.div`
  display: flex;
  flex-flow: column;
  padding-bottom: 20px;
`;

const PostSearchFilterPopupWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 23px;
  padding-bottom: 20px;
`;

const PostSearchFilterTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  text-align: center;
  padding: 32px 0 41px 0;
`;

const ProfileScrapTargetWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  cursor: pointer;
`;

const ProfileScrapTargetAudienceTab = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 18px;
`;

const ProfileScrapTargetAudTabWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default PostSearchFilterPopupBody;
