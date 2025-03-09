import { ReactComponent as EmptyScrapIcon } from 'assets/images/icon/svg/empty/EmptyScrapIcon.svg';
import ProfileScrapListInfiniteScroll from 'hook/ProfileScrapListInfiniteScroll';
import { QueryStateProfileScrapList } from 'hook/queryhook/QueryStateProfileScrapList';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { activeMakeScrapPopupInfoAtom } from 'states/PostAtom';
import styled from 'styled-components';
import theme from '../../../styles/theme';
import ProfileScrapThumbnailListView, {
  ScrapThumnailInfo,
} from './ProfileScrapThumbnailListView';

interface ProfileScrapListBodyProps {
  profileScrapViewRef?: React.RefObject<HTMLDivElement>;
  onButtonEvent: (scrapThumnailInfo: ScrapThumnailInfo) => void;
  mainContainerStyle?: React.CSSProperties;
  isAddMove?: boolean;
  scrapIdList?: string[];
  isInitTimout?: boolean;
}

const ProfileScrapViewBody: React.FC<ProfileScrapListBodyProps> = ({
  profileScrapViewRef,
  onButtonEvent,
  mainContainerStyle,
  isAddMove = false,
  scrapIdList,
  isInitTimout = false,
}) => {
  const { data, isFetched } = QueryStateProfileScrapList();

  const [init, setInit] = useState<boolean>(false);
  const durarion = 500;
  useEffect(() => {
    if (isInitTimout) {
      setTimeout(() => {
        setInit(true);
      }, durarion);
    } else {
      setInit(true);
    }
  }, []);

  const [activeMakeScrapPopupInfo, setActiveMakeScrapPopupInfo] =
    useRecoilState(activeMakeScrapPopupInfoAtom);

  return (
    <ProfileShowProfileScrapViewBodyContainer
      ref={profileScrapViewRef}
      style={mainContainerStyle}
    >
      {data && isFetched && init && (
        <>
          {data.pages.flatMap((v) => v).length > 0 ? (
            <ProfileScrapThumbnailListView
              profileThumbnailScrapList={data?.pages.flatMap((value) => value)}
              isAddMove={isAddMove}
              scrapIdList={scrapIdList}
              onButtonEvent={onButtonEvent}
            />
          ) : (
            <NotScrapWrap>
              <NotScrapImg>
                <EmptyScrapIcon />
              </NotScrapImg>
              <NotScrapTitle>
                등록된 스크랩 없음 <br /> 나만의 취향을 반영한 스크랩을
                만들어보세요.
              </NotScrapTitle>
              <MakeScrapButton
                onClick={() => {
                  setActiveMakeScrapPopupInfo({
                    isActive: true,
                    postId: '',
                    postContentType: '',
                    postContentUrl: '',
                  });
                  // if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
                  //   setActiveMakeScrapPopupInfo({
                  //     isActive: true,
                  //     postId: '',
                  //     postContentType: '',
                  //     postContentUrl: '',
                  //   });
                  // } else {
                  //   stackRouterPush(navigate, PROFILE_NEW_SCRAP_PATH);
                  // }
                }}
              >
                스크랩 추가
              </MakeScrapButton>
            </NotScrapWrap>
          )}
        </>
      )}

      <ProfileScrapListInfiniteScroll />
    </ProfileShowProfileScrapViewBodyContainer>
  );
};

const ProfileShowProfileScrapViewBodyContainer = styled.div`
  min-height: calc(
    100dvh -
      ${theme.systemSize.bottomNavBar.heightNum +
        theme.systemSize.bottomNavBar.heightNum +
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--safe-area-inset-top',
          ),
        ) || 0}px
  );
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const NotScrapWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-flow: column;
`;

const NotScrapImg = styled.div`
  margin: 0 auto;
`;

const NotScrapTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
  white-space: nowrap;
  text-align: center;
`;

const MakeScrapButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 13px;
  margin: 10px auto 0px auto;
  background-color: ${theme.mainColor.Black};
  color: white;
  padding: 10px;
  border-radius: 25px;
  cursor: pointer;
`;

export default ProfileScrapViewBody;
