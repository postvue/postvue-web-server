import { ReactComponent as ScrapSelectIcon } from 'assets/images/icon/svg/scrap/ScrapSelectIcon.svg';
import { convertDifferenceDateTimeByString } from 'global/util/DateTimeUtil';
import React from 'react';
import styled from 'styled-components';

export interface ScrapThumnailInfo {
  scrapId: string;
  scrapName: string;
  scrapNum: number;
  lastPostedAt: string;
}

interface ProfileScrapThumbnailListViewTextProps {
  isAddMove?: boolean;
  scrapIdList?: string[];
  scrapTumnail: ScrapThumnailInfo;
  TextContainerStyle?: React.CSSProperties;
}

const ProfileScrapThumbnailListViewText: React.FC<
  ProfileScrapThumbnailListViewTextProps
> = ({ isAddMove, scrapIdList, scrapTumnail, TextContainerStyle }) => {
  return (
    <>
      <ProfileScrapViewNameActiveWrap style={TextContainerStyle}>
        <ProfileScrapNameAndSunInfoWrap>
          <ProfileScrapViewName>{scrapTumnail.scrapName}</ProfileScrapViewName>
          <ProfileScrapNumDateWrap>
            <ProfileScrapNum>
              {scrapTumnail.scrapNum.toLocaleString()}개
            </ProfileScrapNum>
            <ProfileScrapDate>
              {convertDifferenceDateTimeByString(scrapTumnail.lastPostedAt)}
            </ProfileScrapDate>
          </ProfileScrapNumDateWrap>
        </ProfileScrapNameAndSunInfoWrap>
        {isAddMove &&
          scrapIdList !== undefined &&
          scrapIdList.includes(scrapTumnail.scrapId) && (
            <ActiveSelecteScrapdWrap>
              <ActiveSelecteScrapIconWrap>
                <ScrapSelectIcon />
              </ActiveSelecteScrapIconWrap>
            </ActiveSelecteScrapdWrap>
          )}
      </ProfileScrapViewNameActiveWrap>
    </>
  );
};

const ProfileScrapViewName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const ProfileScrapNameAndSunInfoWrap = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

export default ProfileScrapThumbnailListViewText;
