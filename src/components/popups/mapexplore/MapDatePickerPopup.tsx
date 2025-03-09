import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';

import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { sendOpenCalendarEvent } from 'global/util/reactnative/nativeRouter';
import {
  isMapDatePickerPopupAtom,
  mapDatePickerPopupInfoAtom,
} from 'states/MapExploreAtom';

const MapDatePickerPopup: React.FC = () => {
  const [isMapDatePickerPopup, setIsMapDatePickerPopup] = useRecoilState(
    isMapDatePickerPopupAtom,
  );

  const { windowWidth } = useWindowSize();

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const onClickTab = (prevDay: number, endDate?: Date): void => {
    if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
      setIsMapDatePickerPopup(false);
    } else {
      setIsExternalCloseFunc(true);
    }

    const endDate_ = endDate ? endDate : new Date();

    const today = new Date(); // 현재 날짜
    const pastDate = new Date(); // 새로운 Date 객체 생성
    pastDate.setDate(today.getDate() - prevDay); // 7주 전(49일 전) 날짜 설정

    setMapDatePickerPopupInfo({
      isActive: true,
      dateInfo: {
        startDate: pastDate,
        endDate: endDate_,
      },
    });
  };
  const setMapDatePickerPopupInfo = useSetRecoilState(
    mapDatePickerPopupInfoAtom,
  );

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <>
          <BottomSheetLayout
            isOpen={isMapDatePickerPopup}
            onClose={() => setIsMapDatePickerPopup(false)}
            isExternalCloseFunc={isExternalCloseFunc}
            heightNum={
              270 +
                parseFloat(
                  getComputedStyle(document.documentElement).getPropertyValue(
                    '--safe-area-inset-bottom',
                  ),
                ) || 0
            }
          >
            <MapDatePickerPopupBody>
              <MapDatePickerPopupBodyWrap>
                <MapPickerSettingTab onClick={() => onClickTab(7)}>
                  지난 7일
                </MapPickerSettingTab>
                <MapPickerSettingTab onClick={() => onClickTab(30)}>
                  지난 1개월
                </MapPickerSettingTab>
                <MapPickerSettingTab onClick={() => onClickTab(365)}>
                  지난 1년
                </MapPickerSettingTab>
                <MapPickerSettingTab
                  onClick={() => {
                    if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
                      setIsMapDatePickerPopup(false);
                    } else {
                      setIsExternalCloseFunc(true);
                    }
                    sendOpenCalendarEvent();
                  }}
                >
                  기간 설정
                </MapPickerSettingTab>
              </MapDatePickerPopupBodyWrap>
            </MapDatePickerPopupBody>
          </BottomSheetLayout>
        </>
      ) : (
        <>
          {isMapDatePickerPopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => {
                setIsMapDatePickerPopup(false);
              }}
              popupWrapStyle={{ height: '300px', width: '450px' }}
              popupOverLayContainerStyle={{ zIndex: '2000' }}
            >
              <MapDatePickerPopupBody>
                <MapDatePickerPopupBodyWrap>
                  <MapPickerSettingTab onClick={() => onClickTab(7)}>
                    지난 7일
                  </MapPickerSettingTab>
                  <MapPickerSettingTab onClick={() => onClickTab(30)}>
                    지난 1개월
                  </MapPickerSettingTab>
                  <MapPickerSettingTab onClick={() => onClickTab(365)}>
                    지난 1년
                  </MapPickerSettingTab>
                  <MapPickerSettingTab
                    onClick={() => {
                      sendOpenCalendarEvent();
                    }}
                  >
                    기간 설정
                  </MapPickerSettingTab>
                </MapDatePickerPopupBodyWrap>
              </MapDatePickerPopupBody>
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

const MapDatePickerPopupBody = styled.div``;

const MapDatePickerPopupBodyWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 10px;
`;

const MapPickerSettingTab = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: pointer;
  padding: 10px 20px;
`;

export default MapDatePickerPopup;
