import { ReactComponent as FacebookShareButtonIcon } from 'assets/images/icon/svg/share/FacebookShareButtonIcon.svg';
import { ReactComponent as InstagramShareButtonIcon } from 'assets/images/icon/svg/share/InstagramShareButtonIcon.svg';
import { ReactComponent as KakaoShareButtonIcon } from 'assets/images/icon/svg/share/KakaoShareButtonIcon.svg';
import { ReactComponent as MessageShareButtonIcon } from 'assets/images/icon/svg/share/MessageShareButtonIcon.svg';
import { ReactComponent as PinterestShareButtonIcon } from 'assets/images/icon/svg/share/PinterestShareButtonIcon.svg';
import { ReactComponent as ShareMoreButtonIcon } from 'assets/images/icon/svg/share/ShareMoreButtonIcon.svg';
import { APP_SERVICE_LOWERCASE_NAME } from 'const/AppInfoConst';
import {
  BaseShareSingleOptions,
  isApp,
  sendBasicShareEvent,
  sendDeepLinkShareEvent,
  sendSmsShareEvent,
  sendSnsShareEvent,
  Social,
} from 'global/util/reactnative/nativeRouter';
import { handleShareUtil, ShareInfo } from 'global/util/ShareUtil';
import React from 'react';
import { FacebookShareButton } from 'react-share';
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

    if (isApp()) {
      sendSmsShareEvent(smsHref);
    } else {
      window.location.href = smsHref;
    }
  };

  const sharePopupInfo = useRecoilValue(sharePopupInfoAtom);

  const shareKakao = () => {
    if (sharePopupInfo.address) {
      window.Kakao.Share.sendDefault({
        objectType: 'location',
        address: sharePopupInfo.address,
        addressTitle: '카카오 판교오피스 카페톡',
        content: {
          title: sharePopupInfo.title,
          description: sharePopupInfo.description,
          imageUrl: sharePopupInfo.mainImageUrl,
          link: {
            mobileWebUrl: 'https://developers.kakao.com',
            webUrl: 'https://developers.kakao.com',
          },
        },
        social: {
          likeCount: 286,
          commentCount: 45,
          sharedCount: 845,
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: 'https://developers.kakao.com',
              webUrl: 'https://developers.kakao.com',
            },
          },
        ],
      });
    } else {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '오늘의 디저트',
          description: '아메리카노, 빵, 케익',
          imageUrl: sharePopupInfo.mainImageUrl,
          link: {
            mobileWebUrl:
              'https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13262118&menuNo=200018',
            webUrl:
              'https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13262118&menuNo=200018',
          },
        },
        // social: {
        //   likeCount: 10,
        //   commentCount: 20,
        //   sharedCount: 30,
        // },
        buttons: [
          {
            title: '웹으로 이동',
            link: {
              mobileWebUrl:
                'https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13262118&menuNo=200018',
              webUrl:
                'https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13262118&menuNo=200018',
            },
          },
          {
            title: '앱으로 이동',
            link: {
              mobileWebUrl:
                'https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13262118&menuNo=200018',
              webUrl:
                'https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13262118&menuNo=200018',
            },
          },
        ],
      });
    }
  };

  return (
    <>
      {/* <KakaoInitConfig /> */}
      <AnotherSnsShareContainer style={SnsAnotherSharePoupContainerStyle}>
        <AnotherSnsShareWrap>
          <div
            onClick={() => {
              SMSShareButtonHref(window.location.href, '테스트');
            }}
          >
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <MessageShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>메시지</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </div>
          <AnotherSnsShareItem onClick={() => shareKakao()}>
            <AnotherSnsShareIconWrap>
              <KakaoShareButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>Kakao</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
          {isApp() && (
            <div
              onClick={() => {
                sendSnsShareEvent({
                  title: 'XYZ',
                  message: 'HELLO',
                  social: Social.Instagram,
                } as BaseShareSingleOptions);
              }}
            >
              <AnotherSnsShareItem>
                <AnotherSnsShareIconWrap>
                  <InstagramShareButtonIcon />
                </AnotherSnsShareIconWrap>
                <AnotherSnsShareTitle>Instagram</AnotherSnsShareTitle>
              </AnotherSnsShareItem>
            </div>
          )}
          {/* {isApp() ? (
          <div
            onClick={() =>
              sendSnsShareEvent({
                title: 'Share via',
                message: 'some message',
                url: 'some share url',
                social: Social.Twitter,
              } as BaseShareSingleOptions)
            }
          >
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <XShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>X</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </div>
        ) : (
          <TwitterShareButton
            url={
              'https://pixabay.com/videos/ocean-sea-wave-water-sunset-233867/'
            }
          >
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <XShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>X</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </TwitterShareButton>
        )} */}

          <AnotherSnsShareItem
            onClick={() => {
              const pinterestHref = `https://kr.pinterest.com/pin/create/button/?description=${APP_SERVICE_LOWERCASE_NAME}&media=${sharePopupInfo.mainImageUrl}&url=${sharePopupInfo.shareLink}`;
              if (isApp()) {
                sendDeepLinkShareEvent(pinterestHref);
              } else {
                window.location.href = pinterestHref;
              }
            }}
          >
            <AnotherSnsShareIconWrap>
              <PinterestShareButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>Pinterest</AnotherSnsShareTitle>
          </AnotherSnsShareItem>

          {/* @REFER: 테스트 용어 제거*/}
          {/* <div
            onClick={() => {
              const twitterHref = `twitter://post?message=${encodeURIComponent('테스트')}%20${encodeURIComponent(location.href)}`;
              if (isApp()) {
                sendDeepLinkShareEvent(twitterHref);
              } else {
                window.location.href = twitterHref;
              }
            }}
          >
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <XShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>X</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </div> */}

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
              const shareInfo: ShareInfo = {
                url: sharePopupInfo.shareLink,
                text: '특별한 순간을 함께 눈으로 확인해 보실래요? ❤️',
              };
              if (isApp()) {
                sendBasicShareEvent(shareInfo);
              } else {
                handleShareUtil(shareInfo);
              }
            }}
          >
            <AnotherSnsShareIconWrap>
              <ShareMoreButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>더 보기</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
        </AnotherSnsShareWrap>
      </AnotherSnsShareContainer>
    </>
  );
};

const AnotherSnsShareContainer = styled.div`
  padding: 10px 0 40px 0;
`;

const AnotherSnsShareWrap = styled.div`
  display: flex;
  width: 100%;
`;

const AnotherSnsShareItem = styled.div`
  display: flex;
  flex-flow: column;
  padding: 0 10px;
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
