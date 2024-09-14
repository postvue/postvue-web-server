import { QueryStateProfileScrapList } from 'hook/queryhook/QueryStateProfileScrapList';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import ProfileScarpInfiniteScroll from '../../hook/ProfileScrapnfiniteScroll';
import {
  myProfileScrapAtom,
  myProfileScrapInfoAtom,
} from '../../states/ProfileAtom';
import MasonryLayout from '../layouts/MasonryLayout';
const ProfileScrapBody: React.FC = () => {
  const param = useParams();
  const scrapId = param.scrap_id;
  const { data } = QueryStateProfileScrapList();
  const myProfileScrap = useRecoilValue(myProfileScrapAtom);
  const [profileScrapInfo, setProfileScrapInfo] = useRecoilState(
    myProfileScrapInfoAtom,
  );

  useEffect(() => {
    if (scrapId) {
      const myProfileScrapInfo = data?.pages
        .flatMap((value) => value.myScrapLists)
        .flat()
        .find((v) => v.scrapId === scrapId);

      if (myProfileScrapInfo !== undefined) {
        setProfileScrapInfo({
          scrapListId: myProfileScrapInfo.scrapId,
          scrapName: myProfileScrapInfo.scrapName,
        });
      }
    }
  }, []);

  return (
    <ProfileScrapBodyContainer>
      <ProfileScrapBodyWrap>
        <ProfileScrapTitleEditWrap>
          <ProfileScrapTitleWrap>
            <ProfileScrapTitle>{profileScrapInfo.scrapName}</ProfileScrapTitle>
          </ProfileScrapTitleWrap>
          <ProfileScrapEditButtonWrap>
            <ProfileScrapEditButton>편집하기</ProfileScrapEditButton>
          </ProfileScrapEditButtonWrap>
        </ProfileScrapTitleEditWrap>
        <MasonryLayout
          snsPostUrlList={myProfileScrap.map((v) => {
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
        {scrapId && (
          <>
            {profileScrapInfo.scrapName !== '' ? (
              <ProfileScarpInfiniteScroll scrapId={scrapId} />
            ) : (
              <ProfileScarpInfiniteScroll
                scrapId={scrapId}
                withScrapInfo={true}
                setProfileScrapInfo={setProfileScrapInfo}
              />
            )}
          </>
        )}
      </ProfileScrapBodyWrap>
    </ProfileScrapBodyContainer>
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
const ProfileScrapEditButtonWrap = styled.div``;
const ProfileScrapEditButton = styled.div`
  color: ${({ theme }) => theme.grey.Grey6};
  font: ${({ theme }) => theme.fontSizes.Body3};
  text-decoration-line: underline;
`;

export default ProfileScrapBody;
