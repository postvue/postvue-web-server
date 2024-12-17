import { ReactComponent as ScrapComposeTargetAudTabIcon } from 'assets/images/icon/svg/CategoryCheckIcon.svg';
import { ReactComponent as ScrapComposeTargetAudNotActiveTabIcon } from 'assets/images/icon/svg/CategoryNotCheckIcon.svg';
import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import {
  SEARCH_POST_PATH,
  SEARCH_PROFILE_PATH,
  SEARCH_SCRAP_PATH,
} from 'const/PathConst';
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isActiveSearchPostFilterPopupAtom } from 'states/SearchPostAtom';
import styled from 'styled-components';

interface PostSearchFilterPopupBodyProps {
  searchWord: string;
  FilterPopupContainrStyle?: React.CSSProperties;
  FilterPopupTitleStyle?: React.CSSProperties;
}

const PostSearchFilterPopupBody: React.FC<PostSearchFilterPopupBodyProps> = ({
  searchWord,
  FilterPopupContainrStyle,
  FilterPopupTitleStyle,
}) => {
  const navigate = useNavigate();
  const filterInfoList = [
    { name: '게시글', url: SEARCH_POST_PATH },
    { name: '스크랩', url: SEARCH_SCRAP_PATH },
    { name: '프로필', url: SEARCH_PROFILE_PATH },
  ];

  const location = useLocation();

  const [isActiveSearchPostFilterPopup, setIsActiveSearchPostFilterPopup] =
    useRecoilState(isActiveSearchPostFilterPopupAtom);

  const PostSearchFilterPopupContainerRef = useRef<HTMLDivElement>(null);

  return (
    <PostSearchFilterPopupContainer
      style={FilterPopupContainrStyle}
      ref={PostSearchFilterPopupContainerRef}
    >
      <PostSearchFilterTitle style={FilterPopupTitleStyle}>
        검색 필터
      </PostSearchFilterTitle>
      <PostSearchFilterPopupWrap>
        {filterInfoList.map((value, key) => {
          return (
            <ProfileScrapTargetWrap
              key={key}
              onClick={() => {
                setIsActiveSearchPostFilterPopup(false);
                navigate(`${value.url}/${searchWord}`);
              }}
            >
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
  padding: 0 0 px 0;
`;

const ProfileScrapTargetWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  cursor: pointer;
`;

const ProfileScrapTargetAudienceTab = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const ProfileScrapTargetAudTabWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default PostSearchFilterPopupBody;
