import { HIDDEN_POST_ID_LIST_SESSION } from '../../const/SessionStorageConst';
import { UserSettingInterface } from '../interface/sessionstorage/UserSettingInterface';

export const getHiddenPostIdList = (): string[] => {
  const initHiddenPostIdList: string[] = [];

  const HiddenPostIdList: string[] = JSON.parse(
    sessionStorage.getItem(HIDDEN_POST_ID_LIST_SESSION) ||
      JSON.stringify(initHiddenPostIdList),
  );
  return HiddenPostIdList;
};

export const initHiddenPostIdList = (
  HiddenPostIdList: UserSettingInterface,
): void => {
  sessionStorage.setItem(
    HIDDEN_POST_ID_LIST_SESSION,
    JSON.stringify(HiddenPostIdList),
  );
};

export const addPostToHiddenPostIdList = (postId: string): string[] => {
  const hiddenPostIdList: string[] = getHiddenPostIdList();
  hiddenPostIdList.push(postId);
  sessionStorage.setItem(
    HIDDEN_POST_ID_LIST_SESSION,
    JSON.stringify(hiddenPostIdList),
  );

  return hiddenPostIdList;
};

export const removePostByHiddenPostIdList = (postId: string): string[] => {
  const hiddenPostIdList: string[] = getHiddenPostIdList();
  const newHiddenPostIdList: string[] = hiddenPostIdList.filter(
    (hiddenPostId) => hiddenPostId !== postId,
  );
  sessionStorage.setItem(
    HIDDEN_POST_ID_LIST_SESSION,
    JSON.stringify(newHiddenPostIdList),
  );

  return newHiddenPostIdList;
};
