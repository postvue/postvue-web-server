import { ProfileInfoByDirectMsg } from 'global/interface/profile';
import { api } from '..';
import { FOLLOW_PATH, INFO_PATH, PROFILE_LIST_PATH } from '../appApiPath';

//@REFER: 현재, controller 상에서 작성 했는 데, 주석 처리 함, 수정 필요
export const getProfileFollowInfo = (
  username: string,
): Promise<ProfileInfoByDirectMsg> => {
  return api
    .get(`${PROFILE_LIST_PATH}${FOLLOW_PATH}/${username}${INFO_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
