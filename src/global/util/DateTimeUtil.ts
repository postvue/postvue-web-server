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

    const formattedDateTime = `${dateTime.getFullYear()}년 ${String(
      dateTime.getMonth() + 1,
    ).padStart(2, '0')}월 ${String(dateTime.getDate()).padStart(
      2,
      '0',
    )}일 \n${String(dateTime.getHours()).padStart(2, '0')}:${String(
      dateTime.getMinutes(),
    ).padStart(2, '0')}`;
    return formattedDateTime;
  } catch (e) {
    return NOT_DATE_TIME;
  }
};

export const convertDiffrenceDate = (dateTimeString: string): string => {
  if (dateTimeString === '') {
    return NOT_DATE_TIME;
  }

  try {
    const currentDate: Date = new Date();
    const postDate: Date = new Date(dateTimeString);

    const diffInMillis = currentDate.getTime() - postDate.getTime();
    const diffInHours = diffInMillis / (1000 * 60 * 60);

    const diffInDays = Math.floor(diffInHours / 24);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInDays === 0) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else if (diffInDays < 365) {
      return `${diffInDays}일 전`;
    } else {
      return `${Math.floor(diffInYears)}년 전`;
    }
  } catch (e) {
    return NOT_DATE_TIME;
  }
};

export const convertDate = (dateTimeString: string): Date => {
  return new Date(dateTimeString);
};

export const groupFormatDate = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
