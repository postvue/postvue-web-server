import { ReactComponent as LeftScrollXButtonIcon } from 'assets/images/icon/svg/scrollx/LeftScrollXButton35x35Icon.svg';
import { ReactComponent as RightScrollXButtonIcon } from 'assets/images/icon/svg/scrollx/RightScrollXButton35x35Icon.svg';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { ProfileThumbnailScrapList } from 'global/interface/profile';
import { isApp } from 'global/util/reactnative/nativeRouter';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import ScrollXMoveButtonContainer from '../buttton/ScrollXMoveButtonContainer';
import ProfileScrapThumbnailListViewText from './ProfileScrapThumbnailListViewText';

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
      {isApp() ? (
        <ProfileScrapAppListContainer>
          {profileThumbnailScrapList.map((v, i) => (
            <ProfileScraApppWrap
              key={i}
              onClick={() => {
                onButtonEvent({
                  scrapId: v.scrapId,
                  scrapName: v.scrapName,
                });
              }}
            >
              <>
                {v.postScrapPreviewList.length > 0 ? (
                  <ProfileScrapImgListAppWrap>
                    <ProfileScrapImgListAppSubWrap>
                      {[...v.postScrapPreviewList]
                        .reverse()
                        .slice(0, 4)
                        .map((value, k) => (
                          <ProfileScrapAppImgWrap key={k}>
                            {value.postThumbnailContentType ===
                              POST_IMAGE_TYPE && (
                              <ProfileScrapImgByApp
                                src={value.postThumbnailContent}
                              />
                            )}
                            {value.postThumbnailContentType ===
                              POST_VIDEO_TYPE && (
                              <PostContentVideo
                                autoPlay
                                muted
                                loop
                                playsInline
                                src={value.postThumbnailContent}
                              ></PostContentVideo>
                            )}
                          </ProfileScrapAppImgWrap>
                        ))}
                      {Array.from(
                        {
                          length: Math.max(
                            4 - [...v.postScrapPreviewList].length,
                            0,
                          ),
                        },
                        (_, index) => (
                          <ProfileScrapImgByAppMock key={index} />
                        ),
                      )}
                    </ProfileScrapImgListAppSubWrap>
                  </ProfileScrapImgListAppWrap>
                ) : (
                  <ProfileScrapImgListAppWrap>
                    <ProfileScrapImgListAppSubWrap>
                      {Array.from(
                        {
                          length: 4,
                        },
                        (_, index) => (
                          <ProfileScrapImgByAppMock key={index} />
                        ),
                      )}
                    </ProfileScrapImgListAppSubWrap>
                  </ProfileScrapImgListAppWrap>
                )}
              </>

              <ProfileScrapThumbnailListViewText
                isAddMove={isAddMove}
                scrapIdList={scrapIdList}
                scrapTumnail={v}
                TextContainerStyle={{ paddingLeft: 10 }}
              />
            </ProfileScraApppWrap>
          ))}
        </ProfileScrapAppListContainer>
      ) : (
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
              <>
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
                          {value.postThumbnailContentType ===
                            POST_IMAGE_TYPE && (
                            <ProfileScrapImg src={value.postThumbnailContent} />
                          )}
                          {value.postThumbnailContentType ===
                            POST_VIDEO_TYPE && (
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
                    <ProfileScrapImgWrap>
                      <ProfileScrapImg
                        src={''}
                        style={{ backgroundColor: theme.grey.Grey1 }}
                      />
                    </ProfileScrapImgWrap>
                    <ProfileScrapImgWrap>
                      <ProfileScrapImg
                        src={''}
                        style={{ backgroundColor: theme.grey.Grey1 }}
                      />
                    </ProfileScrapImgWrap>
                    <ProfileScrapImgWrap>
                      <ProfileScrapImg
                        src={''}
                        style={{ backgroundColor: theme.grey.Grey1 }}
                      />
                    </ProfileScrapImgWrap>
                  </ProfileScrapImgListWrap>
                )}
              </>

              <ProfileScrapThumbnailListViewText
                isAddMove={isAddMove}
                scrapIdList={scrapIdList}
                scrapTumnail={v}
              />
            </ProfileScrapWrap>
          ))}
        </>
      )}
    </>
  );
};

const ProfileScrapWrap = styled.div`
  padding: 20px 20px 0px 20px;
  overflow: hidden; /* 부모 자체도 넘침 숨김 */
  min-width: 0; /* 기본 min-content 해제 */
  min-height: 0;
`;

const ProfileScrapAppListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 열 2개 */
`;

const ProfileScraApppWrap = styled.div`
  overflow: hidden; /* 부모 자체도 넘침 숨김 */
  margin-bottom: 10px;
`;

const ProfileScrapImgListAppWrap = styled.div`
  display: grid;
  border-radius: 20px;
  margin: 8px;
`;

const ProfileScrapImgListAppSubWrap = styled.div`
  display: grid;
  border-radius: 20px;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 8px 20px 1px;

  gap: 5px;
  grid-template-columns: repeat(2, 1fr); /* 열 2개 */
  grid-template-rows: repeat(2, 1fr); /* 행 2개 */
`;

const ProfileScrapAppImgWrap = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

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

const ProfileScrapImgByAppMock = styled.div`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 1/1;
  border-radius: 10px;
  background-color: hsl(0, 0%, 97%);
`;

const ProfileScrapImgByApp = styled(ProfileScrapImgByAppMock)<{ src: string }>`
  background: url(${(props) => props.src}) center center / cover;
  border-radius: 10px;
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

export default ProfileScrapThumbnailListView;
