export interface SessionActiveUserListSub {
  sessionActiveUserInfoSubList: SessionActiveUserInfoSub[];
}

export interface SessionActiveUserInfoSub {
  userId: string;
  sessionState: boolean;
  lastActivityDateTime: string;
}
