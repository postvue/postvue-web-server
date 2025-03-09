import { ReactComponent as CloseButtonIcon } from 'assets/images/icon/svg/explore/MapExplorePopupCloseButtonIcon.svg';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { ko } from 'date-fns/locale';
import useOutsideClick from 'hook/customhook/useOutsideClick';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSetRecoilState } from 'recoil';
import {
  isMapDateRangePickerPopupAtom,
  mapDatePickerPopupInfoAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';
import { animationStyle } from 'styles/animations';
import theme from 'styles/theme';

interface DateRangePickerProps {
  onClose: () => void;
  DateRangePickerContainerStyle?: React.CSSProperties;
}

const MapDateRangePickerPopup: React.FC<DateRangePickerProps> = ({
  onClose,
  DateRangePickerContainerStyle,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const { windowWidth } = useWindowSize();

  const datePickerRef = useRef<HTMLDivElement>(null);
  useOutsideClick([datePickerRef], () => {
    onClose();
  });

  const setIsMapDateRangePickerPopup = useSetRecoilState(
    isMapDateRangePickerPopupAtom,
  );

  const setMapDatePickerPopupInfo = useSetRecoilState(
    mapDatePickerPopupInfoAtom,
  );

  const onClickTab = (prevDay: number, endDate?: Date): void => {
    setIsMapDateRangePickerPopup(false);

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

  return (
    <StyledDatePickerWrap
      style={DateRangePickerContainerStyle}
      ref={datePickerRef}
    >
      <DatePickerWrap>
        <HeaderWrap>
          <MapExplorePopupCloseButtonnWrap onClick={onClose}>
            <MapExplorePopupCloseButtonnSubWrap>
              <MapExplorePopupCloseButtonn>
                <CloseButtonIcon />
              </MapExplorePopupCloseButtonn>
            </MapExplorePopupCloseButtonnSubWrap>
          </MapExplorePopupCloseButtonnWrap>
        </HeaderWrap>
        <StyledDatePicker>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              const [start, end] = date;

              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            locale={ko}
            monthsShown={windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 2 : 1}
            maxDate={new Date()}
            preventOpenOnFocus={true}
          />
        </StyledDatePicker>
        <StyledDatePickerSelectWrap>
          <StyledDatePickerSelectSubWrap>
            <StyledDatePickerSelectItem onClick={() => onClickTab(7)}>
              지난 7일
            </StyledDatePickerSelectItem>
            <StyledDatePickerSelectItem onClick={() => onClickTab(30)}>
              지난 1개월
            </StyledDatePickerSelectItem>
            <StyledDatePickerSelectItem onClick={() => onClickTab(365)}>
              지난 1년
            </StyledDatePickerSelectItem>
          </StyledDatePickerSelectSubWrap>

          <StyledDatePickerSelectCompleteButton
            onClick={() => {
              setMapDatePickerPopupInfo({
                isActive: true,
                dateInfo: {
                  startDate: startDate,
                  endDate: endDate,
                },
              });
              setIsMapDateRangePickerPopup(false);
            }}
          >
            완료
          </StyledDatePickerSelectCompleteButton>
        </StyledDatePickerSelectWrap>
      </DatePickerWrap>
    </StyledDatePickerWrap>
  );
};

const StyledDatePickerWrap = styled.div`
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 20px 0px;
  margin: 0;
  width: 100%;
  z-index: 2000;
  position: absolute;
  background-color: white;
  animation: ${animationStyle.fadeIn} 0.15s ease-in-out;
`;

const StyledDatePickerSelectWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px 20px 20px;
`;

const StyledDatePickerSelectSubWrap = styled.div`
  display: flex;
  gap: 10px;
`;

const StyledDatePickerSelectItem = styled.div`
  display: flex;
  padding: 7px 12px;
  border: 1px solid ${theme.grey.Grey2};
  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 12px;
  border-radius: 20px;
  cursor: pointer;
`;

const StyledDatePickerSelectCompleteButton = styled(StyledDatePickerSelectItem)`
  background-color: ${({ theme }) => theme.mainColor.Blue};
  color: white;
  border: 1px solid ${({ theme }) => theme.mainColor.Blue};
`;

const StyledDatePicker = styled.div`
  border-radius: 30px;

  margin: 0 20px 0px 20px;
  display: flex;
  flex: 1;

  & > div {
    display: flex;
  }
  .react-datepicker {
    border: none;

    margin: 20px 0 0 0;

    font-size: 16px;
    font: ${({ theme }) => theme.fontSizes.Body3};
    width: 550px; /* 전체 크기 조정 */
  }
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
    padding: 8px;

    border: 1px solid #ccc;
    font-size: 16px;
    border-radius: 50%;
  }
  .react-datepicker__day {
    // background-color: ${theme.mainColor.White};
    border-radius: 50%;
    width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 2px 0px;
  }

  .react-datepicker__day.react-datepicker__day--in-selecting-range {
    background-color: ${theme.mainColor.SkyBlue0};
    color: white;
    border-radius: 0px;
  }

  .react-datepicker__day--selected.react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-start {
    background-color: ${theme.mainColor.SkyBlue0};
    color: white;
    border-radius: 50% 0% 0 50%;
  }

  .react-datepicker__day--in-range {
    color: white;

    background-color: ${theme.mainColor.SkyBlue0};
    color: white;
    border-radius: 0px;
  }

  .react-datepicker__day.react-datepicker__day--in-range:hover {
    background-color: ${theme.mainColor.Blue};
  }

  .react-datepicker__day.react-datepicker__day--keyboard-selected.react-datepicker__day--range-end.react-datepicker__day--in-range.react-datepicker__day--weekend {
    border-radius: 0px 50% 50% 0;
    background-color: ${theme.mainColor.SkyBlue0};
    transition: all 0.3s ease-in-out;
    position: relative;
    z-index: 1;
    color: white;
  }

  .react-datepicker__day.react-datepicker__day--keyboard-selected.react-datepicker__day--range-end.react-datepicker__day--in-range.react-datepicker__day--weekend::before {
    border-radius: 0px 50% 50% 0;
    border-radius: 50%;
    bottom: 0;
    content: '';
    height: inherit;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1; /* 배경을 뒤로 보냄 */
    background-color: ${theme.mainColor.Blue};
  }

  .react-datepicker__day.react-datepicker__day--keyboard-selected.react-datepicker__day--range-end.react-datepicker__day--in-range {
    border-radius: 0px 50% 50% 0;
    background-color: ${theme.mainColor.SkyBlue0};
    transition: all 0.3s ease-in-out;
    position: relative;
    color: white;
    z-index: 1;
  }

  .react-datepicker__day.react-datepicker__day--keyboard-selected.react-datepicker__day--range-end.react-datepicker__day--in-range::before {
    border-radius: 0px 50% 50% 0;
    border-radius: 50%;
    bottom: 0;
    content: '';
    height: inherit;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1; /* 배경을 뒤로 보냄 */
    background-color: ${theme.mainColor.Blue};
    transition: all 0.3s ease-in-out;
  }
  .react-datepicker__current-month {
    font: ${({ theme }) => theme.fontSizes.Subhead2};
  }
  .react-datepicker__day {
  font: ${({ theme }) => theme.fontSizes.Body3};
  }

  .react-datepicker__day.react-datepicker__day--keyboard-selected.react-datepicker__day--range-end.react-datepicker__day--in-range.react-datepicker__day--outside-month::before {
    border-radius: 0px;
    bottom: 0;
    content: '';
    height: inherit;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1; /* 배경을 뒤로 보냄 */
    background-color: transparent;
  }

  .react-datepicker__header {
    border-bottom: none;
  }

  .react-datepicker__header:not(.react-datepicker__header--has-time-select) {
    background-color: white;
    border-radius: 30px 30px 0 0;
    padding: 30px 0 15px 0;
  }
  .react-datepicker__month-container {
    width: 100%;
    @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
      width: 50%;
    }
  }

  .react-datepicker__day-name {
    width: 12%;
  }

  .react-datepicker__week {
    display: flex;
    justify-content: center;
  }

  .react-datepicker__day.react-datepicker__day--keyboard-selected.react-datepicker__day--in-range {
    background-color: ${theme.mainColor.SkyBlue0};
    color: white
  }

  .react-datepicker__day.react-datepicker__day--selected.react-datepicker__day--range-start.react-datepicker__day--in-range {
    border-radius: 50% 0px 0px 50%;
    background-color: ${theme.mainColor.SkyBlue0};
    color: white
    transition: all 0.3s ease-in-out;
    position: relative;
    z-index: 1;
  }

  .react-datepicker__day.react-datepicker__day--selected.react-datepicker__day--range-start.react-datepicker__day--in-range::before {
    border-radius: 50%;
    bottom: 0;
    content: '';
    height: inherit;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1; /* 배경을 뒤로 보냄 */
    background-color: ${theme.mainColor.Blue};
  }

  .react-datepicker__day.react-datepicker__day--selected {
    background-color: ${theme.mainColor.Blue};
  }

  .react-datepicker__day.react-datepicker__day--selected:hover {
    background-color: ${theme.mainColor.Blue};
    border-radius: 50%;
  }
  .react-datepicker__day.react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-end {
    background-color: ${theme.mainColor.SkyBlue0};
    color: white
    border-radius: 0 50% 50% 0;
  }

  .react-datepicker__day.react-datepicker__day--keyboard-selected {
    background-color: transparent;
    color: black;
  }

  .react-datepicker__day.react-datepicker__day--selected.react-datepicker__day--range-start.react-datepicker__day--range-end.react-datepicker__day--in-range.react-datepicker__day--today {
    background-color: transparent;
  }

  .react-datepicker__day.react-datepicker__day--keyboard-selected.react-datepicker__day--in-selecting-range {
    background-color: ${theme.mainColor.SkyBlue0};
    color: white;
  }
  

  .react-datepicker__day.react-datepicker__day--selected.react-datepicker__day--range-start.react-datepicker__day--in-range.react-datepicker__day--outside-month::before{
    background-color: transparent;
  }
`;

const DatePickerWrap = styled.div`
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    height: 500px;
  }
  display: flex;
  flex-direction: column;
  height: 80dvh;
  max-height: 600px;
`;

const HeaderWrap = styled.div`
  padding: 10px 10px 0 10px;
  display: flex;
  justify-content: right;
`;

const MapExplorePopupCloseButtonnWrap = styled.div`
  right: 0px;
  display: flex;
`;

const MapExplorePopupCloseButtonnSubWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 40px;
  border: 1px solid ${theme.grey.Grey2};
  background-color: white;
  display: flex;
  margin: auto 10px auto 0;
  cursor: pointer;
`;

const MapExplorePopupCloseButtonn = styled.div`
  display: flex;
  margin: auto;
`;

export default MapDateRangePickerPopup;
