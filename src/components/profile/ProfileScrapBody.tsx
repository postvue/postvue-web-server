import SnsSharePopup from 'components/popups/SnsSharePopup';
import { convertDiffrenceDateTime } from 'global/util/DateTimeUtil';
import ProfileScrapInfiniteScroll from 'hook/ProfileScrapInfiniteScroll';
import { QueryStateProfileScrap } from 'hook/queryhook/QueryStateProfileScrap';
import { QueryStateProfileScrapInfo } from 'hook/queryhook/QueryStateProfileScrapInfo';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { profileScrapInfoAtom } from 'states/ProfileAtom';
import { isSharePopupAtom } from 'states/ShareAtom';
import styled from 'styled-components';
import MasonryLayout from '../layouts/MasonryLayout';
const ProfileScrapBody: React.FC = () => {
  const param = useParams();
  const scrapId = param.scrap_id;
  const { data } = QueryStateProfileScrapInfo(scrapId || '');

  const { data: profileScrap } = QueryStateProfileScrap(scrapId || '');
  const [profileScrapInfo, setProfileScrapInfo] =
    useRecoilState(profileScrapInfoAtom);

  const isSharePopup = useRecoilValue(isSharePopupAtom);

  useEffect(() => {
    if (data) {
      const profileScrapInfo = data;
      setProfileScrapInfo({
        scrapId: profileScrapInfo.scrapId,
        scrapName: profileScrapInfo.scrapName,
        scrapNum: profileScrapInfo.scrapNum,
        lastPostedAt: profileScrapInfo.lastPostedAt,
      });
    }
  }, [data]);

  return (
    <>
      <ProfileScrapBodyContainer>
        <ProfileScrapBodyWrap>
          <ProfileScrapTitleEditWrap>
            <ProfileScrapTitleWrap>
              <ProfileScrapTitle>
                {profileScrapInfo.scrapName}
              </ProfileScrapTitle>
              <ProfileScrapNumDateWrap>
                <ProfileScrapNum>
                  {profileScrapInfo.scrapNum.toLocaleString()}개
                </ProfileScrapNum>
                <ProfileScrapDate>
                  {convertDiffrenceDateTime(profileScrapInfo.lastPostedAt)}
                </ProfileScrapDate>
              </ProfileScrapNumDateWrap>
            </ProfileScrapTitleWrap>
            <ProfileScrapEditButtonWrap>
              <ProfileScrapEditButton>편집하기</ProfileScrapEditButton>
            </ProfileScrapEditButtonWrap>
          </ProfileScrapTitleEditWrap>

          {profileScrap?.pages && (
            <MasonryLayout
              snsPostUrlList={profileScrap.pages
                .flatMap((value) => value.myScrapPostList)
                .map((v) => {
                  return {
                    postId: v.postId,
                    userId: v.userId,
                    postContent: v.postThumbnailContent,
                    postContentType: v.postThumbnailContentType,
                    username: v.username,
                    location: v.location,
                  };
                })}
            />
          )}
          {scrapId && (
            <>
              {profileScrapInfo.scrapName !== '' && (
                <ProfileScrapInfiniteScroll scrapId={scrapId} />
              )}
            </>
          )}
        </ProfileScrapBodyWrap>
      </ProfileScrapBodyContainer>
      {isSharePopup && <SnsSharePopup />}
    </>
  );
};

const ProfileScrapBodyContainer = styled.div`
  padding-top: ${({ theme }) => theme.systemSize.header.height};
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
`;

export default ProfileScrapBody;
