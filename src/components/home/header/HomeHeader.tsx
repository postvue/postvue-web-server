import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { ACTIVE_CLASS_NAME } from '../../../const/ClassNameConst';
import { NOTIFICATION_PATH, SEARCH_PATH } from '../../../const/PathConst';
import {
  FOLLOW_FOR_ME_TAB_ID,
  FOLLOW_FOR_ME_TAB_NAME,
  TASTE_FOR_ME_TAB_ID,
  TASTE_FOR_ME_TAB_NAME,
} from '../../../const/TabConfigConst';
import { scrollPositionAtomByFollowForMe } from '../../../states/FollowForMeAtom';
import { homeTabIdAtom } from '../../../states/HomePageAtom';
import { scrollPositionAtomByTasteForMe } from '../../../states/TasteForMeAtom';

const HomeHeader: React.FC = () => {
  const [mainTabId, setMainTabId] = useRecoilState(homeTabIdAtom);
  const [scrollPositionByFollow, setScrollPositionByFollow] = useRecoilState(
    scrollPositionAtomByFollowForMe,
  );
  const [scrollPositionByTaste, setScrollPositionByTaste] = useRecoilState(
    scrollPositionAtomByTasteForMe,
  );

  const mainTabList = [
    {
      tabId: TASTE_FOR_ME_TAB_ID,
      tabName: TASTE_FOR_ME_TAB_NAME,
    },
    {
      tabId: FOLLOW_FOR_ME_TAB_ID,
      tabName: FOLLOW_FOR_ME_TAB_NAME,
    },
  ];
  return (
    <HomeHeaderFilterWrap>
      <HomeTabContainer>
        {mainTabList.map((v, i) => (
          <TabItem
            key={i}
            className={mainTabId === v.tabId ? ACTIVE_CLASS_NAME : ''}
            onClick={() => {
              if (v.tabId === TASTE_FOR_ME_TAB_ID) {
                setScrollPositionByFollow(window.scrollY);
                window.scrollTo({ top: scrollPositionByTaste });
              } else {
                setScrollPositionByTaste(window.scrollY);
                window.scrollTo({ top: scrollPositionByFollow });
              }
              setMainTabId(v.tabId);
            }}
          >
            {v.tabName}
          </TabItem>
        ))}
      </HomeTabContainer>
      <SubTabContainer>
        <FilterTab>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 6C12 6.53043 12.2107 7.03914 12.5858 7.41421C12.9609 7.78929 13.4696 8 14 8C14.5304 8 15.0391 7.78929 15.4142 7.41421C15.7893 7.03914 16 6.53043 16 6M12 6C12 5.46957 12.2107 4.96086 12.5858 4.58579C12.9609 4.21071 13.4696 4 14 4C14.5304 4 15.0391 4.21071 15.4142 4.58579C15.7893 4.96086 16 5.46957 16 6M12 6H4M16 6H20M6 12C6 12.5304 6.21071 13.0391 6.58579 13.4142C6.96086 13.7893 7.46957 14 8 14C8.53043 14 9.03914 13.7893 9.41421 13.4142C9.78929 13.0391 10 12.5304 10 12M6 12C6 11.4696 6.21071 10.9609 6.58579 10.5858C6.96086 10.2107 7.46957 10 8 10C8.53043 10 9.03914 10.2107 9.41421 10.5858C9.78929 10.9609 10 11.4696 10 12M6 12H4M10 12H20M15 18C15 18.5304 15.2107 19.0391 15.5858 19.4142C15.9609 19.7893 16.4696 20 17 20C17.5304 20 18.0391 19.7893 18.4142 19.4142C18.7893 19.0391 19 18.5304 19 18M15 18C15 17.4696 15.2107 16.9609 15.5858 16.5858C15.9609 16.2107 16.4696 16 17 16C17.5304 16 18.0391 16.2107 18.4142 16.5858C18.7893 16.9609 19 17.4696 19 18M15 18H4M19 18H20"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </FilterTab>

        <NotificationTab>
          <Link to={NOTIFICATION_PATH}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 17V18C9 18.7956 9.31607 19.5587 9.87868 20.1213C10.4413 20.6839 11.2044 21 12 21C12.7956 21 13.5587 20.6839 14.1213 20.1213C14.6839 19.5587 15 18.7956 15 18V17M10 5C10 4.46957 10.2107 3.96086 10.5858 3.58579C10.9609 3.21071 11.4696 3 12 3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5C15.1484 5.54303 16.1274 6.38833 16.8321 7.4453C17.5367 8.50227 17.9404 9.73107 18 11V14C18.0753 14.6217 18.2954 15.2171 18.6428 15.7381C18.9902 16.2592 19.4551 16.6914 20 17H4C4.54494 16.6914 5.00981 16.2592 5.35719 15.7381C5.70457 15.2171 5.92474 14.6217 6 14V11C6.05956 9.73107 6.4633 8.50227 7.16795 7.4453C7.8726 6.38833 8.85159 5.54303 10 5Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="17.5" cy="6.5" r="3" fill="#FF5E3A" stroke="white" />
            </svg>
          </Link>
        </NotificationTab>

        <SearchTab>
          <Link to={SEARCH_PATH}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20.4697 21.5302C20.7626 21.823 21.2375 21.823 21.5304 21.5302C21.8233 21.2373 21.8233 20.7624 21.5304 20.4695L20.4697 21.5302ZM19.1676 19.1674L18.6373 19.6977L19.1676 19.1674ZM15.9699 17.0303L18.6373 19.6977L19.698 18.6371L17.0306 15.9697L15.9699 17.0303ZM18.6373 19.6977L20.4697 21.5302L21.5304 20.4695L19.698 18.6371L18.6373 19.6977Z"
                fill="black"
              />
              <circle cx="11" cy="11" r="8" stroke="black" strokeWidth="1.5" />
            </svg>
          </Link>
        </SearchTab>
      </SubTabContainer>
    </HomeHeaderFilterWrap>
  );
};

const HomeHeaderFilterWrap = styled.div`
  display: flex;
  justify-content: left;
  gap: 20px;

  padding: 15px 22px 24px 20px;

  position: sticky;
  top: 0px;
  background-color: ${({ theme }) => theme.mainColor.White};
  gap: 20px;
  justify-content: space-between;
`;

const HomeTabContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const TabItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  color: ${({ theme }) => theme.grey.Grey4};
  cursor: pointer;

  &.active {
    color: black;
    text-decoration: underline;
    text-underline-offset: 10px;
    text-decoration-thickness: px;
  }
`;
const SubTabContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const FilterTab = styled.div`
  cursor: pointer;
`;

const NotificationTab = styled.div`
  cursor: pointer;
`;

const SearchTab = styled.div`
  cursor: pointer;
`;

export default HomeHeader;
