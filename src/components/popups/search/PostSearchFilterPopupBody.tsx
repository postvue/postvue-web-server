import { ReactComponent as ScrapComposeTargetAudTabIcon } from 'assets/images/icon/svg/CategoryCheckIcon.svg';
import { ReactComponent as ScrapComposeTargetAudNotActiveTabIcon } from 'assets/images/icon/svg/CategoryNotCheckIcon.svg';
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
  FilterTargetNameStyle?: React.CSSProperties;
}

const PostSearchFilterPopupBody: React.FC<PostSearchFilterPopupBodyProps> = ({
  searchWord,
  FilterPopupContainrStyle,
  FilterPopupTitleStyle,
  FilterTargetNameStyle,
}) => {
  const navigate = useNavigate();
  const filterInfoList = [
    { name: '게시물', url: SEARCH_POST_PATH },
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
              <ProfileScrapTargetAudienceTab style={FilterTargetNameStyle}>
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
  font-size: 18px;
  text-align: center;
  margin-bottom: 5px;
`;

const ProfileScrapTargetWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  cursor: pointer;
`;

const ProfileScrapTargetAudienceTab = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

const ProfileScrapTargetAudTabWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default PostSearchFilterPopupBody;
