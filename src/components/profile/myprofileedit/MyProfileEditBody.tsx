import BottomNextButton from 'components/common/buttton/BottomNextButton';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import { PROFILE_LIST_PATH } from 'const/PathConst';
import { isValidString } from 'global/util/ValidUtil';
import { QueryMutationPutMyProfileInfo } from 'hook/queryhook/QueryMutationPutMyProfileInfo';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PutMyProfileInfoReq } from 'services/profile/putMyProfileInfo';
import styled from 'styled-components';

const MyProfileEditBody: React.FC = () => {
  const { data: myAccountSettingInfo } = QueryStateMyProfileInfo();
  const navigate = useNavigate();

  const [userNickname, setUserNickname] = useState<string>('');
  const [userIntroduce, setUserIntruoduce] = useState<string>('');
  const [userLink, setUserLink] = useState<string>('');
  const [userProfilePath, setUserProfilePath] = useState<string>('');

  const putMyProfileInfoMutation = QueryMutationPutMyProfileInfo();

  const onClickPutProfileInfo = () => {
    const putMyProfileInfoReq: PutMyProfileInfoReq = {
      nickname: userNickname,
      website: userLink,
      introduce: userIntroduce,
      profilePath: '',
    };
    putMyProfileInfoMutation.mutate(putMyProfileInfoReq);

    if (myAccountSettingInfo?.userId) {
      navigate(`${PROFILE_LIST_PATH}/${myAccountSettingInfo?.username}`, {
        replace: true,
      });
    }
  };

  useEffect(() => {
    if (!myAccountSettingInfo) return;
    setUserNickname(myAccountSettingInfo.nickname);
    setUserIntruoduce(myAccountSettingInfo.introduce);
    setUserLink(myAccountSettingInfo.website);
    setUserProfilePath(myAccountSettingInfo.profilePath);
  }, [myAccountSettingInfo]);

  return (
    <MyProfileEditBodyContainer>
      <MyProfileImgEditWrap>
        <MyProfileImgEditImgSubWrap>
          <MyProfileImgEditImg $src={userProfilePath}>
            <MyProfileImgEdit>수정</MyProfileImgEdit>
          </MyProfileImgEditImg>
        </MyProfileImgEditImgSubWrap>
      </MyProfileImgEditWrap>
      <ProfileAccountSettingElementWrap>
        <ProfileAccountSettingElementTitle>
          이름
        </ProfileAccountSettingElementTitle>
        <ProfileNicknameContent
          value={userNickname}
          onChange={(e) => setUserNickname(e.target.value)}
          placeholder={'프로필에 이름을 입력하세요.'}
        />
      </ProfileAccountSettingElementWrap>
      <BoundaryStickBar />
      <ProfileAccountSettingElementWrap>
        <ProfileAccountSettingElementTitle>
          소개
        </ProfileAccountSettingElementTitle>
      </ProfileAccountSettingElementWrap>
      <ProfileIntroduceContentWrap>
        <ProfileIntroduceTextarea
          maxLength={150}
          rows={4}
          placeholder={`회원님을 소개해 주세요.`}
          value={userIntroduce}
          onChange={(e) => setUserIntruoduce(e.target.value)}
        ></ProfileIntroduceTextarea>
      </ProfileIntroduceContentWrap>
      <BoundaryStickBar />
      <ProfileAccountSettingElementWrap>
        <ProfileAccountSettingElementTitle>
          링크
        </ProfileAccountSettingElementTitle>
        <ProfileNicknameContent
          value={userLink}
          onChange={(e) => setUserLink(e.target.value)}
        />
      </ProfileAccountSettingElementWrap>
      <BoundaryStickBar />

      <BottomNextButton
        title={'저장'}
        isActive={isValidString(userNickname)}
        hasNotActiveElement={true}
        notActiveTitle={'저장'}
        actionFunc={onClickPutProfileInfo}
      />
    </MyProfileEditBodyContainer>
  );
};

const MyProfileEditBodyContainer = styled.div`
  height: calc(100vh - ${({ theme }) => theme.systemSize.header.height});
`;

const MyProfileImgEditWrap = styled.div`
  display: flex;
  margin: 20px 0 0 0;
`;

const MyProfileImgEditImgSubWrap = styled.div`
  margin: 0 auto;
`;

const MyProfileImgEditImg = styled.div<{ $src: string }>`
  background: url(${(props) => props.$src}) center center / cover;
  width: 104px;
  height: 104px;
  border-radius: 55px;

  display: flex;
  cursor: pointer;
`;

const MyProfileImgEdit = styled.div`
  margin: auto auto;
  text-shadow: 0px 3px 7px ${({ theme }) => theme.mainColor.Black};
  color: ${({ theme }) => theme.mainColor.White};
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const ProfileAccountSettingElementWrap = styled.div`
  display: flex;
  padding: 10px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  cursor: pointer;
`;

const ProfileAccountSettingElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  display: flex;
  margin: auto 0;
  white-space: nowrap;
  padding-right: 10px;
`;

const ProfileIntroduceContentWrap = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const ProfileNicknameContent = styled.input`
  width: 100%;
  outline: none;
  color: ${({ theme }) => theme.grey.Grey8};
  font: ${({ theme }) => theme.fontSizes.Body3};
  border: 0px;

  &::placeholder {
    color: ${({ theme }) => theme.errorColor.Red};
  }
`;

const ProfileIntroduceTextarea = styled.textarea`
  resize: none;
  width: 100%;
  border: 0px;
  outline: none;
  color: ${({ theme }) => theme.grey.Grey8};
  font: ${({ theme }) => theme.fontSizes.Body3};
`;

export default MyProfileEditBody;
