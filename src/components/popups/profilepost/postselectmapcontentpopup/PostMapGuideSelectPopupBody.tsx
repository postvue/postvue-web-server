import { ReactComponent as AppleMapGuideIcon } from 'assets/images/icon/svg/explore/mapguide/AppleMapGuideIcon.svg';
import { ReactComponent as GoogleMapGuideIcon } from 'assets/images/icon/svg/explore/mapguide/GoogleMapGuideIcon.svg';
import { ReactComponent as KakaoMapGuideIcon } from 'assets/images/icon/svg/explore/mapguide/KakaoMapGuideIcon.svg';
import { ReactComponent as NaverMapGuideIcon } from 'assets/images/icon/svg/explore/mapguide/NaverMapGuideIcon.svg';
import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import { isApp } from 'global/util/reactnative/nativeRouter';
import React from 'react';
import styled from 'styled-components';
import { filterBrigntnessStyle09 } from 'styles/commonStyles';

interface PostMapGuideSelectPopupBodyProps {
  onClose: () => void;
  latitude: number;
  longitude: number;
  address?: string;
  buildName?: string;
}

const PostMapGuideSelectPopupBody: React.FC<
  PostMapGuideSelectPopupBodyProps
> = ({ onClose, latitude, longitude, address, buildName }) => {
  const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  };
  const isAndroid = (): boolean => /Android/i.test(navigator.userAgent);
  const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const openMapNavigation = ({
    type,
    lat,
    lng,
    label = '목적지',
  }: {
    type: 'kakao' | 'naver' | 'google' | 'apple';
    lat: number;
    lng: number;
    label?: string;
  }) => {
    const mobile = isMobile();
    let didHide = false;

    const onVisibilityChange = () => {
      if (document.hidden) {
        didHide = true; // 앱이 열려 브라우저가 백그라운드로 간 것
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    const cleanUp = () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };

    const fallbackOpen = (url: string) => {
      setTimeout(() => {
        cleanUp();
        if (!didHide) {
          window.open(url, '_blank');
        }
      }, 1000);
    };
    const fallbackWarn = (message: string) => {
      setTimeout(() => {
        cleanUp();
        if (!didHide) {
          alert(message);
        }
      }, 1000);
    };

    if (type === 'kakao') {
      const kakaoApp = `kakaomap://route?ep=${lat},${lng}&by=CAR`;
      // const kakaoWeb = `https://map.kakao.com/link/to/${label},${lat},${lng}`;
      if (mobile) {
        window.location.href = kakaoApp;
        if (!isApp()) {
          fallbackWarn('Kakao 맵이 설치되어있지 않습니다.');
        } else {
          cleanUp();
        }
      } else {
        cleanUp();
        alert('Kakao 맵이 설치되어있지 않습니다.');
      }
    }

    if (type === 'naver') {
      const naverApp = `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(label)}`;
      // const naverWeb = `https://map.naver.com/v5/directions/-/-/${lng},${lat},${label}`;
      if (mobile) {
        window.location.href = naverApp;
        if (!isApp()) {
          fallbackWarn('Naver 맵이 설치되어있지 않습니다.');
        } else {
          cleanUp();
        }
      } else {
        cleanUp();
        alert('Naver 맵이 설치되어있지 않습니다.');
        // window.open(naverWeb, '_blank');
      }
    }

    if (type === 'google') {
      const googleWeb = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
      if (isAndroid()) {
        const androidScheme = `google.navigation:q=${lat},${lng}&mode=d`; // mode: d=drive, w=walk
        window.location.href = androidScheme;
        fallbackOpen(googleWeb);
      } else {
        const iosScheme = `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
        window.location.href = iosScheme;
        fallbackOpen(googleWeb);
      }
    } else if (type === 'apple') {
      const appleApp = `maps://?daddr=${lat},${lng}&dirflg=driving`;
      const appleWeb = `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=driving`;
      if (isIOS()) {
        window.location.href = appleApp;
        fallbackOpen(appleWeb);
      } else {
        cleanUp();
        window.open(appleWeb, '_blank');
      }
    }
  };

  return (
    <PostSettingPopupBodyContainer>
      <PostSettingContextWrap>
        {isMobile() && (
          <>
            <LongPressToResizeButton>
              <PostSettingTab
                onClick={() => {
                  openMapNavigation({
                    type: 'kakao',
                    lat: latitude,
                    lng: longitude,
                    label: address,
                  });

                  onClose();
                }}
              >
                <PostSettingIconWrap>
                  <KakaoMapGuideIcon />
                </PostSettingIconWrap>
                <PostSettingTitle>Kakao 맵</PostSettingTitle>
              </PostSettingTab>
            </LongPressToResizeButton>
            <LongPressToResizeButton>
              <PostSettingTab
                onClick={() => {
                  openMapNavigation({
                    type: 'naver',
                    lat: latitude,
                    lng: longitude,
                    label: address,
                  });

                  onClose();
                }}
              >
                <PostSettingIconWrap>
                  <NaverMapGuideIcon />
                </PostSettingIconWrap>
                <PostSettingTitle>Naver 맵</PostSettingTitle>
              </PostSettingTab>
            </LongPressToResizeButton>
          </>
        )}
        <LongPressToResizeButton>
          <PostSettingTab
            onClick={() => {
              openMapNavigation({
                type: 'google',
                lat: latitude,
                lng: longitude,
                label: address,
              });

              onClose();
            }}
          >
            <PostSettingIconWrap>
              <GoogleMapGuideIcon />
            </PostSettingIconWrap>
            <PostSettingTitle>Google 지도</PostSettingTitle>
          </PostSettingTab>
        </LongPressToResizeButton>
        <LongPressToResizeButton>
          <PostSettingTab
            onClick={() => {
              openMapNavigation({
                type: 'apple',
                lat: latitude,
                lng: longitude,
                label: address,
              });

              onClose();
            }}
          >
            <PostSettingIconWrap>
              <AppleMapGuideIcon />
            </PostSettingIconWrap>
            <PostSettingTitle>Apple 지도</PostSettingTitle>
          </PostSettingTab>
        </LongPressToResizeButton>
      </PostSettingContextWrap>
    </PostSettingPopupBodyContainer>
  );
};

const PostSettingPopupBodyContainer = styled.div`
  position: relative;
  flex-shrink: 1;
`;

const PostSettingContextWrap = styled.div`
  padding: 5px 15px;
  display: flex;
  flex-flow: column;
  gap: 8px;
`;

const PostSettingTab = styled.div`
  padding: 8px 10px;
  display: flex;
  gap: 10px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.grey.Grey05};
  border-radius: 14px;
  ${filterBrigntnessStyle09}
`;

const PostSettingIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

const PostSettingTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  line-height: 200%;
  color: ${({ theme }) => theme.grey.Grey8};
`;

const LinkButtonWrap = styled.div`
  display: flex;
  gap: 10px;
`;

const LinkButtonSubWrap = styled.div`
display
`;

const LinkButtonTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
`;

export default PostMapGuideSelectPopupBody;
