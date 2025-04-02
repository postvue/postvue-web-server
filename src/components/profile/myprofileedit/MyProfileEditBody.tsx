import { AxiosError } from 'axios';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import LoadingPopup from 'components/popups/LoadingPopup';
import { HOME_PATH, PROFILE_ACCOUNT_ROUTE_PATH } from 'const/PathConst';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import { uploadImgUtil } from 'global/util/ImageInputUtil';
import {
  isApp,
  sendNativeImageUploadEvent,
  stackRouterBack,
} from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import { QueryMutationPutMyProfileInfo } from 'hook/queryhook/QueryMutationPutMyProfileInfo';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React, { useEffect, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { PutMyProfileInfoReq } from 'services/profile/putMyProfileInfo';
import { nativeUploadImgFileAtom } from 'states/NativeAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';

const MyProfileEditBody: React.FC = () => {
  const { data: myAccountSettingInfo } = QueryStateMyProfileInfo();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  const [userNickname, setUserNickname] = useState<string>('');
  const [userIntroduce, setUserIntruoduce] = useState<string>('');
  const [userLink, setUserLink] = useState<string>('');
  const [userProfilePath, setUserProfilePath] = useState<string>('');
  const [profileUploadImgFile, setProfileUploadImgFile] = useState<Blob | null>(
    null,
  );

  const goBackOrNavigate = useGoBackOrNavigate(
    myAccountSettingInfo
      ? generatePath(PROFILE_ACCOUNT_ROUTE_PATH, {
          username: myAccountSettingInfo.username,
        })
      : HOME_PATH,
  );

  const putMyProfileInfoMutation = QueryMutationPutMyProfileInfo();

  const [isLoadingPopup, setIsLoadingPopup] =
    useRecoilState(isLoadingPopupAtom);

  const onClickPutProfileInfo = () => {
    const formData = new FormData();
    const putMyProfileInfoReq: PutMyProfileInfoReq = {
      nickname: userNickname,
      website: userLink,
      introduce: userIntroduce,
    };

    const putMyProfileInfoReqBlob = new Blob(
      [JSON.stringify(putMyProfileInfoReq)],
      {
        type: 'application/json',
      },
    );
    formData.append('putMyProfileInfoReq', putMyProfileInfoReqBlob);
    if (profileUploadImgFile) {
      formData.append('profileImgFile', profileUploadImgFile);
    }

    setIsLoadingPopup(true);
    putMyProfileInfoMutation
      .mutateAsync(formData)
      .then(() => {
        if (myAccountSettingInfo?.userId) {
          if (isApp()) {
            stackRouterBack(navigate);
          } else {
            goBackOrNavigate();
          }
        }
      })
      .catch((error: AxiosError) => {
        const data: any = error.response?.data;
        alert(data.message);
      })
      .finally(() => {
        setIsLoadingPopup(false);
      });
  };

  useEffect(() => {
    if (!myAccountSettingInfo) return;
    setUserNickname(myAccountSettingInfo.nickname);
    setUserIntruoduce(myAccountSettingInfo.introduce);
    setUserLink(myAccountSettingInfo.website);
    setUserProfilePath(myAccountSettingInfo.profilePath);
    setLoading(false);
  }, [myAccountSettingInfo]);

  const profileUploadImgId = 'profile-img-edit-id';

  const nativeUploadImgFile = useRecoilValue(nativeUploadImgFileAtom);
  const resetNativeUploadImgFile = useResetRecoilState(nativeUploadImgFileAtom);
  useEffect(() => {
    if (!isApp() || nativeUploadImgFile.imgFile === null) return;

    uploadImgUtil(
      nativeUploadImgFile.imgFile,
      setProfileUploadImgFile,
      setUserProfilePath,
    );
    resetNativeUploadImgFile();
  }, [nativeUploadImgFile]);

  return (
    <>
      {!loading && (
        <MyProfileEditBodyContainer>
          <MyProfileImgEditWrap>
            <MyProfileImgEditImgSubWrap>
              {isApp() ? (
                <ProfileImgUploadImgLabel
                  htmlFor={profileUploadImgId}
                  onClick={() => {
                    sendNativeImageUploadEvent(1);
                  }}
                >
                  <MyProfileImgEditImg $src={userProfilePath}>
                    <MyProfileImgEdit>수정</MyProfileImgEdit>
                  </MyProfileImgEditImg>
                </ProfileImgUploadImgLabel>
              ) : (
                <ProfileImgUploadImgLabel htmlFor={profileUploadImgId}>
                  <MyProfileImgEditImg $src={userProfilePath}>
                    <MyProfileImgEdit>수정</MyProfileImgEdit>
                  </MyProfileImgEditImg>

                  <ProfileImgUploadInput
                    id={profileUploadImgId}
                    accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, image/heic"
                    type="file"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      uploadImgUtil(
                        e.target.files[0],
                        setProfileUploadImgFile,
                        setUserProfilePath,
                      );
                    }}
                  />
                </ProfileImgUploadImgLabel>
              )}
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
              placeholder=""
            />
          </ProfileAccountSettingElementWrap>
          <BoundaryStickBar />

          <BottomNextButton
            title={'저장'}
            isActive={
              (isValidString(userNickname) &&
                myAccountSettingInfo?.nickname !== userNickname) ||
              myAccountSettingInfo?.introduce !== userIntroduce ||
              profileUploadImgFile !== null ||
              myAccountSettingInfo.website !== userLink
            }
            hasNotActiveElement={true}
            notActiveTitle={'저장'}
            actionFunc={onClickPutProfileInfo}
          />
        </MyProfileEditBodyContainer>
      )}
      {isLoadingPopup && <LoadingPopup />}
    </>
  );
};

const MyProfileEditBodyContainer = styled.div`
  padding-top: env(safe-area-inset-top);
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

const ProfileImgUploadImgLabel = styled.label`
  display: flex;
  cursor: pointer;
`;
const ProfileImgUploadInput = styled.input`
  display: none;
`;

export default MyProfileEditBody;
