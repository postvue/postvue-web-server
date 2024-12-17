import { ReactComponent as FacebookShareButtonIcon } from 'assets/images/icon/svg/share/FacebookShareButtonIcon.svg';
import { ReactComponent as KakaoShareButtonIcon } from 'assets/images/icon/svg/share/KakaoShareButtonIcon.svg';
import { ReactComponent as MessageShareButtonIcon } from 'assets/images/icon/svg/share/MessageShareButtonIcon.svg';
import { ReactComponent as PinterestShareButtonIcon } from 'assets/images/icon/svg/share/PinterestShareButtonIcon.svg';
import { ReactComponent as ShareMoreButtonIcon } from 'assets/images/icon/svg/share/ShareMoreButtonIcon.svg';
import { ReactComponent as XShareButtonIcon } from 'assets/images/icon/svg/share/XShareButtonIcon.svg';
import { APP_SERVICE_LOWERCASE_NAME } from 'const/AppInfoConst';
import { handleShareUtil } from 'global/util/shareUtil';
import React from 'react';
import {
  FacebookShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from 'react-share';
import { useRecoilValue } from 'recoil';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import styled from 'styled-components';

interface SnsAnotherSharePoupElementProps {
  SnsAnotherSharePoupContainerStyle?: React.CSSProperties;
}

const SnsAnotherSharePoupElement: React.FC<SnsAnotherSharePoupElementProps> = ({
  SnsAnotherSharePoupContainerStyle,
}) => {
  const SMSShareButtonHref = (url: string, body: string) => {
    const smsHref = `sms:&body=${encodeURIComponent(body)}%20${encodeURIComponent(url)}`;

    return smsHref;
  };

  const sharePopupInfo = useRecoilValue(sharePopupInfoAtom);
  return (
    <AnotherSnsShareContainer style={SnsAnotherSharePoupContainerStyle}>
      <AnotherSnsShareWrap>
        <a href={SMSShareButtonHref(window.location.href, '테스트')}>
          <AnotherSnsShareItem>
            <AnotherSnsShareIconWrap>
              <MessageShareButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>메시지</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
        </a>
        <AnotherSnsShareItem>
          <AnotherSnsShareIconWrap>
            <KakaoShareButtonIcon />
          </AnotherSnsShareIconWrap>
          <AnotherSnsShareTitle>Kakao</AnotherSnsShareTitle>
        </AnotherSnsShareItem>
        <TwitterShareButton
          url={'https://pixabay.com/videos/ocean-sea-wave-water-sunset-233867/'}
        >
          <AnotherSnsShareItem>
            <AnotherSnsShareIconWrap>
              <XShareButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>X</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
        </TwitterShareButton>
        <PinterestShareButton
          url={sharePopupInfo.shareLink}
          media={sharePopupInfo.mainImageUrl}
          description={APP_SERVICE_LOWERCASE_NAME}
        >
          <AnotherSnsShareItem>
            <AnotherSnsShareIconWrap>
              <PinterestShareButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>Pinterest</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
        </PinterestShareButton>
        <FacebookShareButton
          url={sharePopupInfo.shareLink}
          hashtag={APP_SERVICE_LOWERCASE_NAME}
        >
          <AnotherSnsShareItem>
            <AnotherSnsShareIconWrap>
              <FacebookShareButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>Facebook</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
        </FacebookShareButton>
        <AnotherSnsShareItem
          onClick={() => {
            handleShareUtil({
              url: sharePopupInfo.shareLink,
              text: '이것 좀 보세요! 👀',
            });
          }}
        >
          <AnotherSnsShareIconWrap>
            <ShareMoreButtonIcon />
          </AnotherSnsShareIconWrap>
          <AnotherSnsShareTitle>더 보기</AnotherSnsShareTitle>
        </AnotherSnsShareItem>
      </AnotherSnsShareWrap>
    </AnotherSnsShareContainer>
  );
};

const AnotherSnsShareContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  overflow-x: scroll;
`;

const AnotherSnsShareWrap = styled.div`
  padding: 10px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 40px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
`;

const AnotherSnsShareItem = styled.div`
  display: flex;
  flex-flow: column;
`;

const AnotherSnsShareIconWrap = styled.div`
  margin: 0 auto;
`;

const AnotherSnsShareTitle = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Location2};
  color: ${({ theme }) => theme.grey.Grey8};
`;

const ShareUserNickname = styled.div`
  margin: auto 0;
  padding-left: 12px;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
`;

export default SnsAnotherSharePoupElement;
