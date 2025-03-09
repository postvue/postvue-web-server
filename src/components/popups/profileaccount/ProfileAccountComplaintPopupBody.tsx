import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import { UserReportType } from 'const/UserReportConst';
import { isValidString } from 'global/util/ValidUtil';
import React, { useState } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { createProfileAccountReport } from 'services/profile/createProfileAccountReport';
import { activePostComplaintCompletePopupAtom } from 'states/PostAtom';
import { activeProfileAccountComplaintPopupAtom } from 'states/ProfileAtom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface ProfileAccountComplaintPopupBodyProps {
  userId: string;
  username: string;
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileAccountComplaintPopupBody: React.FC<
  ProfileAccountComplaintPopupBodyProps
> = ({ userId, username, setIsExternalCloseFunc }) => {
  const resetActiveProfileAccountComplaintPopup = useResetRecoilState(
    activeProfileAccountComplaintPopupAtom,
  );

  const setActivePostComplaintCompletePopup = useSetRecoilState(
    activePostComplaintCompletePopupAtom,
  );

  const [otherReportContent, setOtherReportConet] = useState<string>('');
  const [otherReportErrorMsg, setOtherReportErrorMsg] = useState<{
    isError: boolean;
    errorMsg: string;
  }>({ isError: false, errorMsg: '' });

  const onClickSendComplaint = (
    userReportReason: string | null,
    userReportReasonType: string,
  ): void => {
    if (!userId) return;
    createProfileAccountReport(userId, {
      userReportReason,
      userReportReasonType,
    })
      .then(() => {
        resetActiveProfileAccountComplaintPopup();
        if (setIsExternalCloseFunc) {
          setIsExternalCloseFunc(true);
        }
        setActivePostComplaintCompletePopup({
          isActive: true,
          userId: userId,
          username: username,
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <ProfileAccountComplaintPopupContainer>
      <PostComplaintTitle>사용자 신고</PostComplaintTitle>
      <PostComplaintPopupWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(
              null,
              UserReportType.USER_SPAM_OR_PROMOTIONAL_CONTENT,
            );
          }}
        >
          스팸/광고성 콘텐츠
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(
              null,
              UserReportType.USER_INAPPROPRIATE_CONTENT,
            );
          }}
        >
          부적절한 콘텐츠
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(
              null,
              UserReportType.USER_FALSE_INFORMATION_FRAUD,
            );
          }}
        >
          허위 정보/사기
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(null, UserReportType.USER_PRIVACY_VIOLATION);
          }}
        >
          개인정보 침해
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(
              null,
              UserReportType.USER_COPYRIGHT_INFRINGEMENT,
            );
          }}
        >
          저작권 침해
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(
              null,
              UserReportType.USER_HARASSMENT_OR_BULLYING,
            );
          }}
        >
          괴롭힘/따돌림
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap>
          <div
            onClick={() => {
              if (!isValidString(otherReportContent)) {
                setOtherReportErrorMsg({
                  isError: true,
                  errorMsg: '',
                });
                return;
              }
              onClickSendComplaint(
                otherReportContent,
                UserReportType.USER_OTHER_REASON,
              );
            }}
          >
            직접 입력
          </div>
          <PostReportOtherContentInput
            placeholder={'신고 내용을 작성해주세요.'}
            onChange={(event) => {
              setOtherReportErrorMsg({
                isError: false,
                errorMsg: '',
              });
              setOtherReportConet(event.target.value);
            }}
            $isReportError={otherReportErrorMsg.isError}
          />
        </PostComplaintTypeWrap>
      </PostComplaintPopupWrap>
      <MyAccountSettingInfoState />
    </ProfileAccountComplaintPopupContainer>
  );
};

const ProfileAccountComplaintPopupContainer = styled.div`
  display: flex;
  flex-flow: column;
`;

const PostComplaintPopupWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 33px;
  padding-bottom: 30px;
`;

const PostComplaintTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  text-align: center;
  padding: 0 0 32px 0;
`;

const PostComplaintTypeWrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: pointer;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostReportOtherContentInput = styled.input<{ $isReportError: boolean }>`
  border: 0px;
  &: focus {
    outline: none;
  }
  &::placeholder {
    color: ${(props) =>
      props.$isReportError ? theme.errorColor.Red : theme.grey.Grey6};
  }
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey8};
  width: 100%;
  padding: 0;
`;

export default ProfileAccountComplaintPopupBody;
