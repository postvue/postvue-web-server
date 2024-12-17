import { HOME_PATH, PROFILE_EDIT_SCRAP_PATH } from 'const/PathConst';
import { TargetAudienceCategory } from 'const/ScrapConst';
import { convertDiffrenceDateTime } from 'global/util/DateTimeUtil';
import { useGoBackOrNavigate } from 'global/util/historyStateUtil';
import ProfileScrapInfiniteScroll from 'hook/ProfileScrapInfiniteScroll';
import { QueryStateProfileScrap } from 'hook/queryhook/QueryStateProfileScrap';
import { QueryStateProfileScrapInfo } from 'hook/queryhook/QueryStateProfileScrapInfo';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { profileScrapInfoAtom } from 'states/ProfileAtom';
import styled from 'styled-components';
import MasonryLayout from '../layouts/MasonryLayout';
const ProfileScrapBody: React.FC = () => {
  const param = useParams();
  const scrapId = param.scrap_id;
  const navigate = useNavigate();

  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);
  const { data: scrapInfo, isFetched: isFetchedByScrapInfo } =
    QueryStateProfileScrapInfo(scrapId || '');

  const { data: profileScrap, isFetched: isFetchedByProfileScrap } =
    QueryStateProfileScrap(scrapId || '');
  const [profileScrapInfo, setProfileScrapInfo] =
    useRecoilState(profileScrapInfoAtom);

  useEffect(() => {
    if (scrapInfo) {
      const profileScrapInfo = scrapInfo;
      setProfileScrapInfo({
        scrapId: profileScrapInfo.scrapId,
        scrapName: profileScrapInfo.scrapName,
        scrapNum: profileScrapInfo.scrapNum,
        lastPostedAt: profileScrapInfo.lastPostedAt,
        isMe: profileScrapInfo.isMe,
        targetAudience: profileScrapInfo.targetAudience,
        userId: profileScrapInfo.userId,
        username: profileScrapInfo.username,
        nickname: profileScrapInfo.nickname,
        profilePath: profileScrapInfo.profilePath,
      });
    }
  }, [isFetchedByScrapInfo]);

  useEffect(() => {
    if (!isFetchedByProfileScrap) return;
  }, [isFetchedByProfileScrap]);

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
            {profileScrapInfo.isMe && (
              <ProfileScrapEditButtonWrap
                onClick={() => {
                  navigate(`${PROFILE_EDIT_SCRAP_PATH}/${scrapId}`);
                }}
              >
                <ProfileScrapEditButton>편집하기</ProfileScrapEditButton>
              </ProfileScrapEditButtonWrap>
            )}
          </ProfileScrapTitleEditWrap>

          {profileScrap?.pages && (
            <MasonryLayout
              snsPostUrlList={profileScrap.pages
                .flatMap((value) => value.scrapPostList)
                .map((v) => {
                  return {
                    postId: v.postId,
                    userId: v.userId,
                    postContent: v.postThumbnailContent,
                    postContentType: v.postThumbnailContentType,
                    username: v.username,
                    location: v.location,
                    previewImg: v.postThumbnailPreviewImg,
                  };
                })}
            />
          )}
          {profileScrap && profileScrapInfo && (
            <>
              {((profileScrapInfo.targetAudience ===
                TargetAudienceCategory.PROTECTED_TARGET_AUDIENCE
                  .targetAudienceValue &&
                profileScrap.pages.flatMap((v) => v.scrapPostList).length <=
                  0) ||
                (!profileScrapInfo.isMe &&
                  profileScrapInfo.targetAudience ===
                    TargetAudienceCategory.PRIVATE_TARGET_AUDIENCE
                      .targetAudienceValue)) && <div>비공개</div>}
            </>
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
    </>
  );
};

const ProfileScrapBodyContainer = styled.div``;

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

export default ProfileScrapBody;
