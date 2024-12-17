import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { ProfileThumbnailScrapList } from 'global/interface/profile';
import { convertDiffrenceDateTime } from 'global/util/DateTimeUtil';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import ScrollXMoveButtonContainer from '../buttton/ScrollXMoveButtonContainer';

interface ProfileScrapThumbnailListViewProps {
  profileThumbnailScrapList: ProfileThumbnailScrapList[];
  onButtonEvent: (scrapId: string) => void;
  isAddMove?: boolean;
  scrapIdList?: string[];
}

const ProfileScrapThumbnailListView: React.FC<
  ProfileScrapThumbnailListViewProps
> = ({ profileThumbnailScrapList, onButtonEvent, isAddMove, scrapIdList }) => {
  const containerRefs = useMemo(
    () =>
      profileThumbnailScrapList.map(() => React.createRef<HTMLDivElement>()),
    [profileThumbnailScrapList],
  );
  return (
    <>
      {profileThumbnailScrapList.map((v, i) => (
        <ProfileScrapWrap key={i}>
          {v.postScrapPreviewList.length > 0 ? (
            <ScrollXMoveButtonContainer
              scrollContainerRef={containerRefs[i]}
              leftMoveNum={300}
              LeftScrollXButtonStyle={{ left: '-20px' }}
              RightScrollXButtonStyle={{ right: '-20px' }}
            >
              <ProfileScrapImgListWrap ref={containerRefs[i]}>
                {[...v.postScrapPreviewList].reverse().map((value, k) => (
                  <ProfileScrapImgWrap
                    key={k}
                    onClick={() => onButtonEvent(v.scrapId)}
                  >
                    {value.postThumbnailContentType === POST_IMAGE_TYPE && (
                      <ProfileScrapImg src={value.postThumbnailContent} />
                    )}
                    {value.postThumbnailContentType === POST_VIDEO_TYPE && (
                      <PostContentVideo
                        autoPlay
                        muted
                        loop
                        playsInline
                        src={value.postThumbnailContent}
                      ></PostContentVideo>
                    )}
                  </ProfileScrapImgWrap>
                ))}
              </ProfileScrapImgListWrap>
            </ScrollXMoveButtonContainer>
          ) : (
            <ProfileScrapImgListWrap>
              <ProfileScrapImgWrap onClick={() => onButtonEvent(v.scrapId)}>
                <ProfileScrapImg
                  src={''}
                  style={{ backgroundColor: theme.grey.Grey2 }}
                />
              </ProfileScrapImgWrap>
            </ProfileScrapImgListWrap>
          )}

          <ProfileScrapViewNameActiveWrap>
            <ProfileScrapNameAndSunInfoWrap>
              <ProfileScrapViewName>{v.scrapName}</ProfileScrapViewName>
              <ProfileScrapNumDateWrap>
                <ProfileScrapNum>
                  {v.scrapNum.toLocaleString()}개
                </ProfileScrapNum>
                <ProfileScrapDate>
                  {convertDiffrenceDateTime(v.lastPostedAt)}
                </ProfileScrapDate>
              </ProfileScrapNumDateWrap>
            </ProfileScrapNameAndSunInfoWrap>
            {isAddMove &&
              scrapIdList !== undefined &&
              scrapIdList.includes(v.scrapId) && (
                <ActiveSelecteScrapdWrap>
                  <ActiveSelecteScrapIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <rect width="20" height="20" fill="white" />
                    <path
                      d="M2.5 10C2.5 10.9849 2.69399 11.9602 3.0709 12.8701C3.44781 13.7801 4.00026 14.6069 4.6967 15.3033C5.39314 15.9997 6.21993 16.5522 7.12987 16.9291C8.03982 17.306 9.01509 17.5 10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 9.01509 17.306 8.03982 16.9291 7.12987C16.5522 6.21993 15.9997 5.39314 15.3033 4.6967C14.6069 4.00026 13.7801 3.44781 12.8701 3.0709C11.9602 2.69399 10.9849 2.5 10 2.5C9.01509 2.5 8.03982 2.69399 7.12987 3.0709C6.21993 3.44781 5.39314 4.00026 4.6967 4.6967C4.00026 5.39314 3.44781 6.21993 3.0709 7.12987C2.69399 8.03982 2.5 9.01509 2.5 10Z"
                      fill="#1D77FF"
                      stroke="#1D77FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 10.0002L9.16667 11.6668L10.8333 10.0002L12.5 8.3335"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </ActiveSelecteScrapIcon>
                </ActiveSelecteScrapdWrap>
              )}
          </ProfileScrapViewNameActiveWrap>
        </ProfileScrapWrap>
      ))}
    </>
  );
};

const ProfileScrapWrap = styled.div`
  padding: 0 20px 22px 20px;
`;

const ProfileScrapViewName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const ProfileScrapNameAndSunInfoWrap = styled.div``;

const ProfileScrapImgListWrap = styled.div`
  display: flex;
  gap: 3px;
  overflow-x: auto;
  white-space: nowrap;

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProfileScrapImgWrap = styled.div`
  width: 30%;
  flex: 0 0 auto;

  cursor: pointer;
`;

const ProfileScrapImg = styled.div<{ src: string }>`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3/4;
  background: url(${(props) => props.src}) center center / cover;
  border-radius: 8px;
  background-color: hsl(0, 0%, 97%);
`;

const PostContentVideo = styled.video`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3/4;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.mainColor.Black};
`;

const ProfileScrapViewNameActiveWrap = styled.div`
  padding-top: 7px;
  display: flex;
  gap: 8px;
`;

const ActiveSelecteScrapdWrap = styled.div`
  display: flex;
`;

const ActiveSelecteScrapIcon = styled.svg`
  margin: auto 0px;
`;

const ProfileScrapNumDateWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const ProfileScrapNum = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey8};
`;

const ProfileScrapDate = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey4};
`;

export default ProfileScrapThumbnailListView;
