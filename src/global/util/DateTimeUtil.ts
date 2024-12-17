import { NOT_DATE_TIME } from '../../const/SystemPhraseConst';

export const convertDtStrToDStr = (dateTimeString: string): string => {
  try {
    return dateTimeString.split('T')[0];
  } catch (e) {
    return NOT_DATE_TIME;
  }
};

export const convertDtStrToDTStr = (dateTimeString: string): string => {
  if (dateTimeString === '') {
    return NOT_DATE_TIME;
  }

  try {
    const dateTime = new Date(dateTimeString);

    const year = dateTime.getFullYear();
    const monthNum = dateTime.getMonth() + 1;
    const month = String(monthNum).padStart(2, '0');
    const dayNum = dateTime.getDate();
    const day = String(dayNum).padStart(2, '0');
    const hourNum = dateTime.getHours();
    const hour = String(hourNum).padStart(2, '0');
    const minutesNum = dateTime.getMinutes();
    const minutes = String(minutesNum).padStart(2, '0');

    const formattedDateTime = `${year}년 ${month}월 ${day}일 \n${hour}시 ${minutes}분`;
    return formattedDateTime;
  } catch (e) {
    return NOT_DATE_TIME;
  }
};

export const convertDiffrenceDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) {
    return NOT_DATE_TIME;
  }

  try {
    const currentDate = new Date();
    const postDate = new Date(dateTimeString);

    const diffInMillis = currentDate.getTime() - postDate.getTime();
    const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
    const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));

    // 1. 같은 날인 경우 (시간 차이만 보여줌)
    if (diffInHours < 1) {
      return `${diffInMinutes}분 전`;
    }

    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }

    // 2. 1년 미만일 때는 일 단위로 표시
    const diffInDays = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));
    if (diffInDays < 365) {
      return `${diffInDays}일 전`;
    }

    // 3. 1년 이상인 경우 정확한 년 차이 계산
    let diffInYears = currentDate.getFullYear() - postDate.getFullYear();
    const hasBirthdayPassedThisYear =
      currentDate.getMonth() > postDate.getMonth() ||
      (currentDate.getMonth() === postDate.getMonth() &&
        currentDate.getDate() >= postDate.getDate());

    if (!hasBirthdayPassedThisYear) {
      diffInYears--;
    }

    return `${diffInYears}년 전`;
  } catch (e) {
    return NOT_DATE_TIME;
  }
};

export const checkAgeDate = (dateString: string, minAge: number): boolean => {
  if (!dateString) {
    return false;
  }

  try {
    const currentDate = new Date();
    const birthDate = new Date(dateString);

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassedThisYear =
      currentDate.getMonth() > birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() >= birthDate.getDate());

    // 생일이 지나지 않았으면 나이를 1 줄임
    if (!hasBirthdayPassedThisYear) {
      age--;
    }

    return age >= minAge;
  } catch (e) {
    return false;
  }
};

export const convertDate = (dateTimeString: string): Date => {
  return new Date(dateTimeString);
};

export const groupFormatDate = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getIsRetentionTimeInMinutes = (
  dateTime: Date,
  retentionMinutes: number,
): boolean => {
  const currentDate: Date = new Date();

  const diffInMillis = currentDate.getTime() - dateTime.getTime();
  const diffInMinutes = diffInMillis / (1000 * 60);

  if (diffInMinutes < retentionMinutes) {
    return true;
  } else {
    return false;
  }
};

export const getDateNDaysAgo = (nDay: number): Date => {
  const today = new Date();
  const nDaysAgo = new Date(today);
  nDaysAgo.setDate(today.getDate() - nDay);
  return nDaysAgo;
};

export const getDateFormatToServerDateTimeString = (date: Date): string => {
  const isoString = date.toISOString(); // 2024-10-05T22:55:42.026Z 형태
  return isoString.split('.')[0];
};
