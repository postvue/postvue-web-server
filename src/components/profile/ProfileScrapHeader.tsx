import { ReactComponent as ProfilePostMapExploreButtonIcon } from 'assets/images/icon/svg/post/ProfilePostMapScrapButtonIcon.svg';
import AccountShareButton from 'components/common/buttton/AccountShareButton';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { getRandomImage } from 'global/util/ShareUtil';
import { QueryStateProfileScrap } from 'hook/queryhook/QueryStateProfileScrap';
import { QueryStateProfileScrapInfo } from 'hook/queryhook/QueryStateProfileScrapInfo';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { activeMapScrapPopupAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

const ProfileScrapHeader: React.FC = () => {
  const param = useParams();
  const scrapId = param.scrap_id;
  const { data: profileScrap, isFetched: isFetchedByProfileScrap } =
    QueryStateProfileScrap(scrapId || '');

  const { data: scrapInfo } = QueryStateProfileScrapInfo(scrapId || '');

  const setActiveMapScrapPopup = useSetRecoilState(activeMapScrapPopupAtom);

  return (
    <PrevButtonHeaderHeader
      titleName=""
      RightButtonNode={
        <ScrapRightButtonWrap>
          <ScrapRightButtonSubWrap
            onClick={() => {
              if (!scrapId) return;
              setActiveMapScrapPopup({ isActive: true, scrapId: scrapId });
            }}
          >
            <ProfilePostMapExploreButtonIcon />
          </ScrapRightButtonSubWrap>
          <AccountShareButton
            url={window.location.href}
            text={scrapInfo?.scrapName || ''}
            mainImageUrl={getRandomImage(
              profileScrap?.pages
                .flatMap((value) => value.snsPostRspList)
                .map((v) => v.postContents)
                .flatMap((v) => v)
                .filter((v) => v.postContentType === POST_IMAGE_TYPE)
                .map((v) => v.content) || [],
              scrapInfo?.profilePath || '',
            )}
          />
        </ScrapRightButtonWrap>
      }
    />
  );
};

const ScrapRightButtonWrap = styled.div`
  display: flex;
  gap: 10px;
`;

const ScrapRightButtonSubWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default ProfileScrapHeader;
