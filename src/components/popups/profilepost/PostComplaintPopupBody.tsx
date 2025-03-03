import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import { PostReportType } from 'const/PostReportConst';
import { isValidString } from 'global/util/ValidUtil';
import React, { useState } from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { createPostReport } from 'services/post/createPostReport';
import {
  activePostComplaintCompletePopupAtom,
  activePostComplaintPopupAtom,
} from 'states/PostAtom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface PostComplainPopup {
  postId: string;
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostComplaintPopupBody: React.FC<PostComplainPopup> = ({
  postId,
  setIsExternalCloseFunc,
}) => {
  const [activePostComplaintPopup, setActivePostComplaintPopup] =
    useRecoilState(activePostComplaintPopupAtom);

  const resetActivePostComplaintPopup = useResetRecoilState(
    activePostComplaintPopupAtom,
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
    postReportReason: string | null,
    postReportReasonType: string,
  ): void => {
    if (!postId) return;
    createPostReport(postId, { postReportReason, postReportReasonType })
      .then(() => {
        if (setIsExternalCloseFunc) {
          setIsExternalCloseFunc(true);
        }
        setActivePostComplaintCompletePopup({
          isActive: true,
          userId: activePostComplaintPopup.userId,
          username: activePostComplaintPopup.username,
        });
        resetActivePostComplaintPopup();
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <PostComplaintPopupContainer>
      <PostComplaintTitle>게시물 신고</PostComplaintTitle>
      <PostComplaintPopupWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(null, PostReportType.DISLIKE);
          }}
        >
          게시물이 마음에 들지 않습니다.
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(null, PostReportType.INACCURATE_LOCATION);
          }}
        >
          위치 정보가 정확하지 않습니다.
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(null, PostReportType.SPAM_OR_SCAM);
          }}
        >
          스팸, 사기 또는 스캠
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(null, PostReportType.SENSITIVE_CONTENT);
          }}
        >
          민감한 사진 또는 동영상을 보여주고 있습니다.
        </PostComplaintTypeWrap>
        <PostComplaintTypeWrap
          onClick={() => {
            onClickSendComplaint(null, PostReportType.HARMFUL_OR_ABUSIVE);
          }}
        >
          가학적이거나 유해한 내용입니다.
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
              onClickSendComplaint(otherReportContent, PostReportType.OTHER);
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
      {activePostComplaintPopup.isActive && <MyAccountSettingInfoState />}
    </PostComplaintPopupContainer>
  );
};

const PostComplaintPopupContainer = styled.div`
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

export default PostComplaintPopupBody;
