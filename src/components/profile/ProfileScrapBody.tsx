import FloatingActionButtonLayout from 'components/layouts/FloatingActionButtonLayout';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import { PROFILE_EDIT_SCRAP_ROUTE_PATH, SEARCH_PATH } from 'const/PathConst';
import { SEARCH_PAGE_NAME } from 'const/ReactNativeConst';
import { convertDiffrenceDateTimeByString } from 'global/util/DateTimeUtil';
import {
  navigateToTabWithUrl,
  stackRouterPush,
} from 'global/util/reactnative/nativeRouter';
import ProfileScrapInfiniteScroll from 'hook/ProfileScrapInfiniteScroll';
import { QueryStateProfileScrap } from 'hook/queryhook/QueryStateProfileScrap';
import { QueryStateProfileScrapInfo } from 'hook/queryhook/QueryStateProfileScrapInfo';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface ProfileScrapBodyProps {
  scrapId: string;
  isEdit?: boolean;
}
const ProfileScrapBody: React.FC<ProfileScrapBodyProps> = ({
  scrapId,
  isEdit = true,
}) => {
  const navigate = useNavigate();

  const {
    data: scrapInfo,
    isFetched: isFetchedByScrapInfo,
    isError: isErrorByScrapInfo,
  } = QueryStateProfileScrapInfo(scrapId);

  const { data: profileScrap, isFetched: isFetchedByProfileScrap } =
    QueryStateProfileScrap(scrapId);

  return (
    <>
      {isFetchedByScrapInfo && scrapInfo && isFetchedByProfileScrap && (
        <>
          <ProfileScrapBodyContainer>
            <ProfileScrapBodyWrap>
              <ProfileScrapTitleEditWrap>
                <ProfileScrapTitleWrap>
                  <ProfileScrapTitle>{scrapInfo?.scrapName}</ProfileScrapTitle>
                  <ProfileScrapNumDateWrap>
                    <ProfileScrapNum>
                      {scrapInfo.scrapNum.toLocaleString()}개
                    </ProfileScrapNum>
                    <ProfileScrapDate>
                      {convertDiffrenceDateTimeByString(scrapInfo.lastPostedAt)}
                    </ProfileScrapDate>
                  </ProfileScrapNumDateWrap>
                </ProfileScrapTitleWrap>
                {scrapInfo.isMe && isEdit && (
                  <ProfileScrapEditButtonWrap
                    onClick={() => {
                      if (!scrapId) return;
                      stackRouterPush(
                        navigate,
                        generatePath(PROFILE_EDIT_SCRAP_ROUTE_PATH, {
                          scrapId: scrapId,
                        }),
                      );
                    }}
                  >
                    <ProfileScrapEditButton>편집하기</ProfileScrapEditButton>
                  </ProfileScrapEditButtonWrap>
                )}
              </ProfileScrapTitleEditWrap>

              {!isErrorByScrapInfo && profileScrap?.pages && (
                <SnsPostMasonryLayout
                  snsPostList={profileScrap.pages.flatMap(
                    (value) => value.snsPostRspList,
                  )}
                  scrapId={scrapId}
                />
              )}
              {isErrorByScrapInfo && (
                <PrivateScrapTitle>비어있는 스크랩입니다.</PrivateScrapTitle>
              )}
              {scrapInfo &&
                !isErrorByScrapInfo &&
                profileScrap &&
                profileScrap?.pages.flatMap((v) => v.snsPostRspList).length <=
                  0 && (
                  <>
                    {scrapInfo.scrapNum > 0 ? (
                      <PrivateScrapTitle>
                        비공개 스크랩입니다.
                      </PrivateScrapTitle>
                    ) : (
                      <PrivateScrapTitle>
                        비어있는 스크랩입니다.
                      </PrivateScrapTitle>
                    )}
                  </>
                )}

              {scrapInfo && scrapId && (
                <>
                  {scrapInfo.scrapName !== '' && (
                    <ProfileScrapInfiniteScroll scrapId={scrapId} />
                  )}
                </>
              )}
            </ProfileScrapBodyWrap>
          </ProfileScrapBodyContainer>
          {scrapInfo.isMe && isEdit && (
            <FloatingActionButtonLayout bottomGap={0}>
              <ProfileAddPostScrapWrap>
                <MakeScrapButtonIcon
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                >
                  <path
                    d="M6.49992 0.958252V12.0416M0.958252 6.49992H12.0416"
                    stroke="#3D4248"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </MakeScrapButtonIcon>
                <ProfileAddPostScrap
                  onClick={() => {
                    navigateToTabWithUrl(
                      navigate,
                      SEARCH_PAGE_NAME,
                      SEARCH_PATH,
                    );
                  }}
                >
                  게시물 추가
                </ProfileAddPostScrap>
              </ProfileAddPostScrapWrap>
            </FloatingActionButtonLayout>
          )}
        </>
      )}
    </>
  );
};

const ProfileScrapBodyContainer = styled.div`
  min-height: calc(100dvh - ${theme.systemSize.header.height});
`;

const ProfileScrapBodyWrap = styled.div``;

const ProfileScrapTitleEditWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 21px 15px 39px 15px;
`;
const ProfileScrapTitleWrap = styled.div``;
const ProfileScrapTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline3};
`;

const ProfileScrapNumDateWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const ProfileScrapNum = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey8};
`;

const ProfileScrapDate = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey4};
`;
const ProfileScrapEditButtonWrap = styled.div``;
const ProfileScrapEditButton = styled.div`
  color: ${({ theme }) => theme.grey.Grey6};
  font: ${({ theme }) => theme.fontSizes.Body3};
  text-decoration-line: underline;
  cursor: pointer;
`;

const PrivateScrapTitle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};
`;

const ProfileAddPostScrapWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const ProfileAddPostScrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey8};
`;

const MakeScrapButtonIcon = styled.svg`
  margin: auto 0;
`;

export default ProfileScrapBody;
