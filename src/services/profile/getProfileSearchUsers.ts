import { ProfileUsername } from 'global/interface/profile';
import { CURSOR_PARAM } from 'services/appApiQueryParam';
import { privateApi } from '..';
import { PROFILE_SEARCH_USERS_API_PATH } from '../appApiPath';

export interface GetProfileSearchUsersRsp {
  getProfileUserByUsernameList: ProfileUsername[];
  cursorId: string;
}

export const getProfileSearchUsers = (
  username: string,
  cursorId: string,
): Promise<GetProfileSearchUsersRsp> => {
  return privateApi
    .get(
      `${PROFILE_SEARCH_USERS_API_PATH}/${username}?${CURSOR_PARAM}=${cursorId}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
