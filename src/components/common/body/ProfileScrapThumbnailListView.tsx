import { ReactComponent as ScrapSelectIcon } from 'assets/images/icon/svg/scrap/ScrapSelectIcon.svg';
import { ReactComponent as LeftScrollXButtonIcon } from 'assets/images/icon/svg/scrollx/LeftScrollXButton35x35Icon.svg';
import { ReactComponent as RightScrollXButtonIcon } from 'assets/images/icon/svg/scrollx/RightScrollXButton35x35Icon.svg';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { ProfileThumbnailScrapList } from 'global/interface/profile';
import { convertDiffrenceDateTimeByString } from 'global/util/DateTimeUtil';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import ScrollXMoveButtonContainer from '../buttton/ScrollXMoveButtonContainer';

export interface ScrapThumnailInfo {
  scrapId: string;
  scrapName: string;
}

interface ProfileScrapThumbnailListViewProps {
  profileThumbnailScrapList: ProfileThumbnailScrapList[];
  onButtonEvent: (scrapThumnailInfo: ScrapThumnailInfo) => void;
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
        <ProfileScrapWrap
          key={i}
          onClick={() => {
            onButtonEvent({
              scrapId: v.scrapId,
              scrapName: v.scrapName,
            });
          }}
        >
          {v.postScrapPreviewList.length > 0 ? (
            <ScrollXMoveButtonContainer
              scrollContainerRef={containerRefs[i]}
              leftMoveNum={300}
              LeftScrollXButtonStyle={{ left: '-20px' }}
              RightScrollXButtonStyle={{ right: '-20px' }}
              ScrollLeftIcon={<LeftScrollXButtonIcon />}
              ScrollRightIcon={<RightScrollXButtonIcon />}
            >
              <ProfileScrapImgListWrap ref={containerRefs[i]}>
                {[...v.postScrapPreviewList].reverse().map((value, k) => (
                  <ProfileScrapImgWrap key={k}>
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
              <ProfileScrapImgWrap
                onClick={() =>
                  onButtonEvent({ scrapId: v.scrapId, scrapName: v.scrapName })
                }
              >
                <ProfileScrapImg
                  src={''}
                  style={{ backgroundColor: theme.grey.Grey1 }}
                />
              </ProfileScrapImgWrap>
              <ProfileScrapImgWrap
                onClick={() =>
                  onButtonEvent({ scrapId: v.scrapId, scrapName: v.scrapName })
                }
              >
                <ProfileScrapImg
                  src={''}
                  style={{ backgroundColor: theme.grey.Grey1 }}
                />
              </ProfileScrapImgWrap>
              <ProfileScrapImgWrap
                onClick={() =>
                  onButtonEvent({ scrapId: v.scrapId, scrapName: v.scrapName })
                }
              >
                <ProfileScrapImg
                  src={''}
                  style={{ backgroundColor: theme.grey.Grey1 }}
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
                  {convertDiffrenceDateTimeByString(v.lastPostedAt)}
                </ProfileScrapDate>
              </ProfileScrapNumDateWrap>
            </ProfileScrapNameAndSunInfoWrap>
            {isAddMove &&
              scrapIdList !== undefined &&
              scrapIdList.includes(v.scrapId) && (
                <ActiveSelecteScrapdWrap>
                  <ActiveSelecteScrapIconWrap>
                    <ScrapSelectIcon />
                  </ActiveSelecteScrapIconWrap>
                </ActiveSelecteScrapdWrap>
              )}
          </ProfileScrapViewNameActiveWrap>
        </ProfileScrapWrap>
      ))}
    </>
  );
};

const ProfileScrapWrap = styled.div`
  padding: 20px 20px 0px 20px;
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
  border-radius: 20px;
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
  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;
`;

const ActiveSelecteScrapIconWrap = styled.div`
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
